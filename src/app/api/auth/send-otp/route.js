import dbConnect from "@/lib/dbConnect";
import OTPModels from "@/models/OTP.models";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {

    await dbConnect();
    const reqBody = await req.json();
    const { mobileNumber } = reqBody;
    
    function generateVerificationCode() {
        const code = Math.floor(Math.random() * 900000 + 100000);
        return code.toString();
    }
    
    const verificationCode = generateVerificationCode();
    
    try {

        const existedOtp = await OTPModels.findOne({mobileNumber});
        if (existedOtp) {
            await OTPModels.deleteOne({mobileNumber});
        }
        
        const otp = await OTPModels.create([{
            mobileNumber,
            verificationCode,
            expiresIn: Date.now() + 5 * 60 * 1000
        }], )

        const otpSent = await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${verificationCode}&flash=0&numbers=${mobileNumber}`)
        console.log(otpSent.data);
        

        if (!otpSent.data.return || !otp) {

            return NextResponse.json({
                message: 'OTP not sent !!!',
                success: false
            }, { status: 200 })
        }

        return NextResponse.json({
            message: "OTP sent successfully....",
            success: true
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 200 })
    }
}