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

        const order = await Order.findById(orderId);        
        if(!order){
            return NextResponse.json({
                message: "No order found",
                success: false
            }, { status: 400 })
        }

        if (order?.paymentMode === 'ONLINE') {

            let statusUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${order?.transactionId}`;

            let string = `/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${order?.transactionId}` + process.env.NEXT_PUBLIC_PHONEPE_API_KEY;
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
            let updatedOrder;

            if (
                response?.data?.success &&
                response?.data?.code === "PAYMENT_SUCCESS") {

                updatedOrder = await Order.findOneAndUpdate({ _id: orderId },
                    { paymentStatus: true }, { new: true }
                ).populate('address products.product');

            }
            return NextResponse.json({
                message: "Order placed successfully",
                success: response?.data?.success,
                order: updatedOrder
            }, { status: 200 })
        }

        return NextResponse.json({
            message: "Invalid payment mode",
            success: false,
        }, { status: 400 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            success: false,
            message: "Something went wrong"
         }, { status: 500 })
    }
}