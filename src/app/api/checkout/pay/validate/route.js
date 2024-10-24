import { NextResponse } from "next/server";
import uniqid from 'uniqid';
import sha256 from "sha256";
import axios from "axios";

export async function GET(request) {
    try {

        const { searchParams } = new URL(request.url);
        const transactionId = searchParams.get('transactionId');

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

            const response = await axios.request(config)
        


            // const response = await axios.request(options)

            // if (response.data && response.data.code === "PAYMENT_SUCCESS") {

            // }
            // else if (response.data && response.data.code === "PAYMENT_ERROR") {

            // }

            return NextResponse.json({ response: response.data })

        }



    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 })
    }
}