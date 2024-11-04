import { NextResponse } from "next/server";
import uniqid from 'uniqid';
import sha256 from "sha256";
import axios from "axios";
import Order from "@/models/Order.models";
import Jwt from 'jsonwebtoken'
import { log } from "winston";

export async function GET(request) {
    try {

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
            const newOrder = await Order.findOne({ transactionId });
            console.log("response : ", response.data);
            
            return NextResponse.json({ 
                amount: (response.data?.data?.amount) / 100,
                success: response.data?.success
            })

            // if (!newOrder) {
            //     const token = Jwt.sign({
            //         success: false,
            //         amount: 0,
            //         transactionId: transactionId
            //     },
            //         process.env.PAYMENT_STATUS_TOKEN_SECRET,
            //         { expiresIn: '5m' }
            //     )

            //     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/bag/order-details?token=${token}`)
            // }
            if (
                response?.data?.success &&
                response?.data?.code === "PAYMENT_SUCCESS") {

                const token = Jwt.sign({
                    success: true,
                    amount: response.data?.data?.amount,
                    transactionId: response.data?.data?.transactionId
                },
                    process.env.NEXT_PUBLIC_PAYMENT_STATUS_TOKEN_SECRET,
                    { expiresIn: '5m' }
                )

                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/bag/order-details?token=${token}`)
            }
            else if (
                !(response?.data?.success) ||
                response?.data?.code === "PAYMENT_ERROR" ||
                response?.data?.code === "INTERNAL_SERVER_ERROR") {

                const token = Jwt.sign({
                    success: false,
                    amount: response.data?.data?.amount,
                    transactionId: response.data?.data?.transactionId
                },
                    process.env.NEXT_PUBLIC_PAYMENT_STATUS_TOKEN_SECRET,
                    { expiresIn: '5m' }
                )

                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/bag/order-details?token=${token}`)
            }

        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 })
    }
}