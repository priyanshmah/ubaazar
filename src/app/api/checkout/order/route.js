import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import sha256 from "sha256";
import axios from "axios";
import crypto from 'crypto';
import { log } from "winston";

export async function POST(request) {
    try {

        await dbConnect();
        const reqBody = await request.json();
        const { products, address, paymentMode } = reqBody;

        if (!(Array.isArray(products)) || products.length <= 0 || !paymentMode)
            return NextResponse.json({ message: "Products or payment mode not defined" }, { status: 404 })

        if (!address.name ||
            !address.pinCode ||
            !address.mobileNumber ||
            !address.address ||
            !address.area ||
            !address.city ||
            !address.state
        ) return NextResponse.json({ message: "Incomplete Address" }, { status: 404 })

        const addressData = {
            name: address.name,
            pincode: address.pinCode,
            mobileNumber: address.mobileNumber,
            address: address.address,
            area: address.area,
            city: address.city,
            state: address.state
        }

        const newAddress = await Address.create(addressData);


        //please check the inventory left then process order and then calculate the total amount to be paid
        const productIds = products.map(item => item.product);
        const dbProducts = await Product.find({ _id: { $in: productIds } });

        let totalAmount = 0;
        for (const item of products) {

            const product = dbProducts.find(p => p._id.toString() === item.product);
            if (!product) {
                return NextResponse.json({
                    message: `Product with id ${item.product} not found`
                }, { status: 404 });
            }

            if (product.inventory && (product.inventory < item.quantity)) {
                return NextResponse.json({
                    message: `${product.productName} is out of stock`
                }, { status: 400 });
            }

            if (product.sizes) {
                const sizeToBeOrdered = product.sizes?.filter(
                    (value) => value.size?.toString() === item.size
                )
                if (sizeToBeOrdered[0].inventory < item.quantity) {
                    return NextResponse.json({
                        message: `${product.productName} is out of stock`
                    }, { status: 400 });
                }
            }

            totalAmount += product.price * item.quantity;
        }


        if (paymentMode === 'cod') {

            const orderData = {
                products,
                address: newAddress._id,
                totalAmount: totalAmount,
                paymentMode,
                orderNumber: generateOrderNumber()
            }

            const newOrder = await Order.create(orderData);
            await updateInventory(products, dbProducts);

            return NextResponse.json({
                message: "Order placed successfully",
                orderId: newOrder._id
            }, { status: 200 })

        }
        else if (paymentMode === 'online') {

            const transactionId = uuid();
            const paymentUrl = await initializePayment(transactionId, totalAmount);

            const orderData = {
                products,
                address: newAddress._id,
                totalAmount: totalAmount,
                paymentMode,
                transactionId,
                orderNumber: generateOrderNumber()
            }
            const newOrder = await Order.create(orderData);
            if (!newOrder) {
                return NextResponse.json({ message: 'Order cancelled' }, { status: 404 })
            }
            

            if (paymentUrl) {
                return NextResponse.json({ url: paymentUrl }, { status: 200 })
            } else {
                return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
            }
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}

async function initializePayment(merchantTransactionId, amount) {
    try {

        const payEndPoint = "/pg/v1/pay"
        const merchantUserId = uuid();
        const redirectUrl = `https://www.ubaazar.com/bag/order-details?transactionId=${merchantTransactionId}`

        const payload = {
            "merchantId": process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
            "merchantTransactionId": merchantTransactionId,
            "merchantUserId": merchantUserId,
            "amount": 5 * 100,
            "redirectUrl": redirectUrl,
            "redirectMode": "REDIRECT",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
        const base64EncodedPayload = bufferObj.toString('base64');

        // const xVerify = sha256(
        //     base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY
        // ) + '###' + 1;

        const xVerify = crypto.createHash('sha256')
            .update(base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY)
            .digest('hex') + '###' + 1;


        const options = {
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_PHONEPE_HOST_URL}${payEndPoint}`,
            // url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": xVerify,
            },
            data: {
                request: base64EncodedPayload
            }
        }



        const response = await axios.request(options);
        const paymentUrl = (response.data.data?.instrumentResponse?.redirectInfo?.url);

        return paymentUrl;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateInventory(products, dbProducts) {
    const bulkOps = products.map(item => {
        const product = dbProducts.find(p => p._id.toString() === item.product);

        if (product?.inventory) {
            return {
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { inventory: -item.quantity } }
                }
            };
        } else if (product?.sizes) {
            return {
                updateOne: {
                    filter: { _id: product._id, "sizes.size": item.size },
                    update: { $inc: { "sizes.$.inventory": -item.quantity } }
                }
            };
        }
    }).filter(Boolean);

    if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
    }
}

function generateOrderNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
