import { NextResponse } from "next/server";
import sha256 from "sha256";
import axios from "axios";
import Order from "@/models/Order.models";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Product from "@/models/Product.models";

export async function POST(request) {
    try {

        await dbConnect();

        const reqBody = await request.json();
        const { orderId } = reqBody;

        if (!orderId) {
            return NextResponse.json({
                message: "Order Id not found",
                success: false
            }, { status: 200 })
        }

        const order = await Order.findById(orderId).lean();
        if (!order) {
            return NextResponse.json({
                message: "No order found",
                success: false
            }, { status: 200 })
        }

        let orderDetails;
        let isPaymentComplete = false;

        if (order?.paymentInfo?.method === 'ONLINE') {

            let statusUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${order?.paymentInfo?.transactionId}`;

            let string = `/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${order?.paymentInfo?.transactionId}` + process.env.NEXT_PUBLIC_PHONEPE_API_KEY;
            const shaString = sha256(string);
            const xVerify = shaString + '###' + process.env.NEXT_PUBLIC_PHONEPE_API_INDEX;


            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: statusUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': xVerify,
                    'X-MERCHANT-ID': process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID
                },
                data: ''
            };

            const response = await axios.request(config);

            if ( response?.data?.success && response?.data?.code === "PAYMENT_SUCCESS") {

                orderDetails = await Order.findOneAndUpdate(
                    { _id: orderId }, { paymentStatus: true }, { new: true }
                ).lean();

                isPaymentComplete = true;
            }

            else {
                orderDetails = await Order.findOneAndUpdate(
                    { _id: orderId }, { paymentStatus: false }, { new: true }
                ).lean();

                isPaymentComplete = false;
            }

        }
        else if (order?.paymentInfo?.method === 'COD') {

            orderDetails = await Order.findOneAndUpdate({ _id: orderId },
                { paymentStatus: true }, { new: true }
            );
            isPaymentComplete = true;

        }
        
        let productIds = orderDetails?.products?.map((value) => value.product);
        let productInfo = await Product
            .find({ _id: { $in: productIds } })
            .select("_id productName price variants")
            .lean();


        const address = await Address.findById(orderDetails.address).lean();

        orderDetails.address = address;
        orderDetails.products = orderDetails?.products?.map((productObj) => {

            let detailedProduct = productInfo.find(p =>
                p._id.toString() === productObj.product.toString()
            );
            const variant = detailedProduct?.variants?.find(
                value => value._id.toString() === productObj.variantId.toString()
            );



            return {
                ...productObj, product: {
                    _id: detailedProduct?._id,
                    image: variant?.images?.at(0),
                    price: detailedProduct?.price,
                    productName: detailedProduct?.productName || ''
                }
            };
        });

        return NextResponse.json({
            message: "Order details fetched successfully....",
            orderDetails,
            orderPlaced: isPaymentComplete,
            success: false,
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}