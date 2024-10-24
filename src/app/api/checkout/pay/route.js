import { NextResponse } from "next/server";
import uniqid from 'uniqid';
import sha256 from "sha256";
import axios from "axios";
import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

export async function GET(request) {
    try {

        

        const payEndPoint = "/pg/v1/pay"
        const merchantTransactionId = uniqid();
        const merchantUserId = uniqid();

        logger.info("merchant id : ", process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID);
        

        const redirectUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/checkout/pay/validate?transactionId=${merchantTransactionId}`

        

        const payload = {
            "merchantId": process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
            // "merchantId": "PGTESTPAYUAT",
            "merchantTransactionId": merchantTransactionId,
            "merchantUserId": merchantUserId,
            "amount": 2 * 100,
            "redirectUrl": redirectUrl,
            "redirectMode": "REDIRECT",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
        const base64EncodedPayload = bufferObj.toString('base64');

        const xVerify = sha256(
            base64EncodedPayload + payEndPoint + process.env.NEXT_PUBLIC_PHONEPE_API_KEY
        ) + '###' + 1;


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
        logger.info("Response Info: ", response.data);

        const paymentUrl = (response.data.data?.instrumentResponse?.redirectInfo?.url);
        logger.info("Payment Url: ", paymentUrl)

        return NextResponse.json({ url: paymentUrl})
        

        // if (paymentUrl) return NextResponse.redirect(paymentUrl)
        // else {
    
        //     return NextResponse.json({ error : response.data }, { status: 500})
        // }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 })
    }
}