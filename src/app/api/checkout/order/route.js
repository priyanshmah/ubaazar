import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import axios from "axios";
import crypto from 'crypto'
import { AuthenticateUser } from "@/lib/authenticateUser";
import User from "@/models/User.models";
import Suits from "@/models/products/Suits&Kurtas.models";
import Sarees from "@/models/products/Sarees.models";


export async function POST(request) {

    await dbConnect();
    const user = await AuthenticateUser(request);

    try {
        const reqBody = await request.json();
        const { products, address, paymentMode } = reqBody;

        if (!(Array.isArray(products)) || products.length <= 0 || !paymentMode)
            return NextResponse.json({
                message: "Products or payment mode not defined",
                success: false
            }, { status: 400 })

        if (!address.name || !address.mobileNumber)
            return NextResponse.json({
                message: "Name or mobile number not found",
                success: false
            }, { status: 400 })

        if ((!address.pinCode ||
            !address.address ||
            !address.area ||
            !address.city ||
            !address.state) && !address.formatted_address) {
            return NextResponse.json({
                message: "Incomplete address",
                success: false
            }, { status: 400 })
        }

        const addressData = {
            name: address.name,
            pincode: address.pinCode,
            mobileNumber: address.mobileNumber,
            address: address.address,
            area: address.area,
            city: address.city,
            state: address.state,
            formatted_address: address.formatted_address
        }

        const newAddress = await Address.create(addressData);


        // please check the inventory left then process order and then calculate the total amount to be paid
        const productIds = products.map(item => item.product);
        const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

        let totalAmount = 0;
        for (const item of products) {

            const product = dbProducts.find(p => p._id.toString() === item.product);
            if (!product) {
                return NextResponse.json({
                    message: `Product with id ${item.product} not found`,
                    success: false
                }, { status: 400 });
            }


            if (product.inventory && (product.inventory < item.quantity)) {
                return NextResponse.json({
                    message: `${product.productName} is out of stock`,
                    success: false
                }, { status: 400 });
            }

            if (product.sizes) {
                const sizeToBeOrdered = product.sizes?.find(
                    (value) => value.size?.toString() === item.size
                )

                if (sizeToBeOrdered.quantity < item.quantity) {
                    return NextResponse.json({
                        message: `${product.productName} is out of stock`,
                        success: false
                    }, { status: 400 });
                }
            }

            totalAmount += product.price * item.quantity;
        }


        if (paymentMode === 'cod') {

            const orderData = {
                products,
                address: newAddress._id,
                totalAmount: totalAmount + 79,
                paymentMode,
                orderNumber: generateOrderNumber()
            }

            const newOrder = await Order.create(orderData);
            let updatedUser;

            await updateInventory(products);

            if (user) {
                updatedUser = await User.findByIdAndUpdate(
                    user._id,
                    { $push: { previousOrders: newOrder._id } },
                    { new: true }
                )

            }

            return NextResponse.json({
                message: "Order placed successfully",
                orderId: newOrder._id,
                user: updatedUser,
                success: true
            }, { status: 200 })

        }
        else if (paymentMode === 'online') {

            const transactionId = uuid();
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


            if (user) {
                await User.findByIdAndUpdate(
                    user._id,
                    { $push: { previousOrders: newOrder._id } },
                )

            }

            const paymentUrl = await initializePayment(
                transactionId, newOrder._id, totalAmount
            );
            if (paymentUrl) {
                return NextResponse.json({
                    url: paymentUrl,
                    success: true
                }, { status: 200 })
            } else {
                return NextResponse.json({
                    message: 'Something went wrong',
                    success: false
                }, { status: 500 })
            }
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


async function initializePayment(merchantTransactionId, orderId, amount) {
    try {

        const payEndPoint = "/pg/v1/pay"
        const merchantUserId = uuid();
        const redirectUrl = `https://www.ubaazar.com/bag/pay/payment-details/${orderId}`

        const payload = {
            "merchantId": process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
            "merchantTransactionId": merchantTransactionId,
            "merchantUserId": merchantUserId,
            "amount": amount * 100,
            "redirectUrl": redirectUrl,
            "redirectMode": "REDIRECT",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
        const base64EncodedPayload = bufferObj.toString('base64');

        const xVerify = crypto.createHash('sha256')
            .update(base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY)
            .digest('hex') + '###' + 1;


        const options = {
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_PHONEPE_HOST_URL}${payEndPoint}`,
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


async function updateInventory(products) {
    for (const item of products) {
        try {
            const product = await Product.findById(item.product);
            if (!product) return null;

            if (product.category === 'suits') {

                const updatedProduct = await Suits.hydrate(product);

                updatedProduct?.sizes?.map(size => {
                    if (size.size.toString() === item.size.toString()) {
                        size.quantity -= item.quantity;
                    }
                    return size;
                })
                await updatedProduct.save();
                return updatedProduct;
            }
            else if (product.category === 'sarees') {

                const updatedProduct = await Sarees.hydrate(product);
                updatedProduct.inventory -= item.quantity;

                await updatedProduct.save();
                return updatedProduct;
            }

        } catch (error) {
            console.error('Inventory update error:', error);
            return null;
        }
    }
}


function generateOrderNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
