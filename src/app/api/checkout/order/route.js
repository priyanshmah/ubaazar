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
import Coupon from "@/models/Coupon.models";
import BagModels from "@/models/Bag.models";


export async function POST(request) {

    await dbConnect();
    const user = await AuthenticateUser(request);

    // if (!user || !user._id)
    //     return NextResponse.json({
    //         message: "User credentials not found or expired",
    //         success: false
    //     }, { status: 200 })

    try {
        const reqBody = await request.json();
        let { products, addressId, paymentMode, couponCode } = reqBody;

        if (!(Array.isArray(products)) || products.length <= 0 || !paymentMode)
            return NextResponse.json({
                message: "Products or payment mode not defined",
                success: false
            }, { status: 200 });

        if (!addressId)
            return NextResponse.json({
                message: "AddressId not defined",
                success: false
            }, { status: 200 });

        const address = await Address.findById(addressId);
        if (!address)
            return NextResponse.json({
                message: "Address not found",
                success: false
            }, { status: 200 });



        const productIds = products.map(item => item.id);
        const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

        console.log("yahantak aa gya");


        let totalAmount = 0;
        for (let item of products) {

            const product = dbProducts.find(p => p?._id?.toString() === item?.id);
            const isValidVariant = product?.variants?.find(variant => variant._id.toString() === item.variantId)
            if (!product || (product.variants?.length > 0 && !isValidVariant)) {
                return NextResponse.json({
                    message: `Product or variant with id ${item.product} not found`,
                    success: false
                }, { status: 200 });
            }

            totalAmount += product.price * item.quantity;
        }

        products.forEach((value) => {
            if (!value.product) {
                value.product = value.id
            }
        })

        console.log("coupon or discount");


        let coupon;
        let discount = 0;

        if (couponCode && user) {
            coupon = await Coupon.findOne({ code: couponCode });

            if (coupon) {
                const isUserHave = (user.coupons?.includes(coupon._id));
                const previouslyUsed = user.usedCoupons?.some(item =>
                    (item.couponId.toString() === coupon._id.toString()) &&
                    (item.usedCount >= coupon.userUsageLimit))
                const isValid = isUserHave && !previouslyUsed;

                if (isValid && (totalAmount >= coupon.minPurchase)) {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discount = Math.min(totalAmount * (coupon.discountValue / 100), coupon.maxDiscount || Infinity);
                    }
                    else if (coupon.discountType === 'FIXED') discount = coupon.discountValue

                    await User.findByIdAndUpdate(
                        user._id,
                        {
                            $pull: { coupons: coupon._id },
                            $push: { usedCoupons: { couponId: coupon._id, usedCount: 1 } }
                        },
                        { new: true }
                    );
                }
            }
        };

        if (paymentMode === 'COD') {

            const orderData = {
                orderNumber: generateOrderNumber(),
                user: user._id,
                products,
                address: addressId,
                paymentInfo: {
                    method: 'COD',
                    status: 'PENDING'
                },
                status: 'PENDING',
                priceDetails: {
                    subTotal: totalAmount,
                    shippingCharge: 0,
                    codCharge: 79,
                    discount,
                    total: totalAmount + 79 - discount
                },
                appliedCoupon: coupon ? coupon._id : null,
            }

            const newOrder = await Order.create(orderData);
            if (!newOrder) {
                NextResponse.json({
                    message: "Order not placed",
                    success: true
                }, { status: 200 })
            }

            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $push: { previousOrders: newOrder?._id } },
                { new: true }
            )

            if (!updatedUser) {
                NextResponse.json({
                    message: "Order placed successfully but user not updated",
                    orderId: newOrder._id,
                    success: true
                }, { status: 200 })
            }

            const userBag = await BagModels.findByIdAndUpdate(user?.bag, { items: [] });
            if (!userBag)
                NextResponse.json({
                    message: "Order placed successfully but cart not cleared",
                    orderId: newOrder._id,
                    success: true
                }, { status: 200 })


            const response = await axios.post('https://www.ubaazar.com/api/orders',
                JSON.stringify({
                    orderIds: [newOrder._id]
                })
            )

            if (!response.data?.success || !response.data?.orders?.at(0))
                return NextResponse.json({
                    message: "Order placed but data not found",
                    success: false
                }, { status: 200 })


            return NextResponse.json({
                message: "Order placed successfully",
                order: response.data?.orders?.at(0),
                success: true
            }, { status: 200 })

        }
        else if (paymentMode === 'ONLINE') {

            console.log("payment mode");


            const transactionId = uuid();
            const orderData = {
                orderNumber: generateOrderNumber(),
                user: user?._id || null,
                products,
                address: addressId,
                paymentInfo: {
                    method: 'ONLINE',
                    status: 'PENDING',
                    transactionId
                },
                status: 'PENDING',
                priceDetails: {
                    subTotal: totalAmount,
                    shippingCharge: 0,
                    codCharge: 0,
                    discount,
                    total: totalAmount - discount
                },
                appliedCoupon: coupon ? coupon._id : null,
            }

            const newOrder = await Order.create(orderData);
            if (!newOrder)
                return NextResponse.json({
                    message: 'Order cancelled',
                    success: false
                }, { status: 200 })


            if (user && user._id) await User.findByIdAndUpdate(
                user._id,
                { $push: { previousOrders: newOrder._id } },
            )


            const url = await initializePayment(
                transactionId, newOrder._id, totalAmount
            );
            if (url) {
                return NextResponse.json({
                    message: "Payment url generated...",
                    success: true,
                    url,
                }, { status: 200 })
            } else {
                return NextResponse.json({
                    message: 'Something went wrong while generating url',
                    success: false
                }, { status: 200 })
            }
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 200 })
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
            "callbackUrl": redirectUrl,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
        const base64EncodedPayload = bufferObj.toString('base64');

        // const xVerify = crypto.createHash('sha256')
        //     .update(base64EncodedPayload + payEndPoint + 'ZTU1NTMwYWYtZDAwNS00Mzk1LWJiYmUtMzk1Y2U1MjYzNGU3')
        //     .digest('hex') + '###' + 1;

        // const xVerify = crypto.createHash('sha256')
        //     .update(base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY)
        //     .digest('hex') + '###' + 1;

        const stringToHash = base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY;
        const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const xVerify = hash + '###' + 1;


        const options = {
            url: `${process.env.NEXT_PUBLIC_PHONEPE_HOST_URL}${payEndPoint}`,
            method: 'post',
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": xVerify,
            },
            data: JSON.stringify({
                request: base64EncodedPayload
            })
        }

        const response = await axios.request(options);
        const paymentUrl = (response.data.data?.instrumentResponse?.redirectInfo?.url);

        return paymentUrl || null;




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
    return Date.now().toString().slice(-8);
}
