import { NextResponse } from "next/server";
import sha256 from "sha256";
import axios from "axios";
import Order from "@/models/Order.models";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
    try {

        await dbConnect();

        const reqBody = await request.json();
        const { transactionId } = reqBody;

        if (transactionId) {

            let statusUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${transactionId}`;

            let string = `/pg/v1/status/${process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID}/${transactionId}` + process.env.NEXT_PUBLIC_PHONEPE_API_KEY;
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

            if (
                response?.data?.success &&
                response?.data?.code === "PAYMENT_SUCCESS") {

                await Order.findOneAndUpdate({ transactionId },
                    { paymentStatus: true }
                );

            }
            return NextResponse.json({
                amount: (response.data?.data?.amount) / 100,
                success: response.data?.success
            })
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 })
    }
}