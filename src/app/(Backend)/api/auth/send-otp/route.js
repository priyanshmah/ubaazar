import dbConnect from "@/lib/dbConnect";
import OTPModels from "@/models/OTP.models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {

    await dbConnect();
    const reqBody = await req.json();
    const { mobileNumber } = reqBody;
    
    function generateVerificationCode() {
        const code = Math.floor(Math.random() * 9000 + 1000);
        return code.toString();
    }
    
    const verificationCode = generateVerificationCode();
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {

        const existedOtp = await OTPModels.findOne({mobileNumber}).session(session);
        if (existedOtp) {
            await OTPModels.deleteOne({mobileNumber}).session(session);
        }
        
        const otp = await OTPModels.create([{
            mobileNumber,
            verificationCode,
            expiresIn: Date.now() + 5 * 60 * 1000
        }], { session })

        const otpSent = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${verificationCode}&flash=0&numbers=${mobileNumber}`, { method: 'GET' })

        if (!otpSent.ok || !otp) {

            await session.abortTransaction();
            session.endSession();

            return NextResponse.json({
                error: 'OTP not sent !!!',
            }, { status: 500 })
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            message: "OTP sent successfully....",
            success: true
        })

    } catch (error) {
        console.log(error);
        
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}