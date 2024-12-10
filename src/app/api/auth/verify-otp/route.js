import dbConnect from "@/lib/dbConnect";
import OTPModels from "@/models/OTP.models";
import User from "@/models/User.models";
import { NextResponse } from "next/server";
import generateTokens from "@/lib/generateTokens";

export async function POST(request) {

    await dbConnect();
    const reqBody = await request.json();
    const { mobileNumber, enteredOTP } = reqBody;

    if (!mobileNumber || !enteredOTP)
        return NextResponse.json({
            message: "Mobile number or OTP not found",
            success: false
        }, { status: 400 })

    try {

        const otpRecord = await OTPModels.findOne({ mobileNumber });

        if (!otpRecord) {
            return NextResponse.json({
                message: "OTP not sent !!!",
                success: false
            }, { status: 400 })
        }


        const expiryDate = new Date(otpRecord.expiresIn).getTime();

        if (Date.now() > expiryDate) {
            return NextResponse.json({
                message: "OTP expired",
                success: false
            }, { status: 400 })
        }

        if (otpRecord.verificationCode == enteredOTP) {

            await OTPModels.deleteOne({ mobileNumber });

            const existedUser = await User.findOne({ mobileNumber })
            if (existedUser) {

                const { accessToken, refreshToken } =
                    await generateTokens(existedUser._id);

                if (!accessToken || !refreshToken)
                    return NextResponse.json({
                        message: "Failed to generate your tokens",
                        success: false
                    }, { status: 400 })


                return NextResponse.json({
                    message: "Logged in successfully....",
                    success: true,
                    accessToken,
                    refreshToken
                }, { status: 200 })

            }
            else {
                const newUser = await User.create({
                    mobileNumber,
                    username: mobileNumber
                })

                if (!newUser) {
                    return NextResponse.json({
                        message: "New User not created",
                        success: true
                    }, { status: 400 })
                }

                const { accessToken, refreshToken } =
                    await generateTokens(newUser._id);

                if (!accessToken || !refreshToken)
                    return NextResponse.json({
                        message: "Failed to generate your tokens",
                        success: false
                    }, { status: 400 })

                return NextResponse.json({
                    message: "OTP verified successfully....",
                    success: true,
                    user: newUser,
                    accessToken,
                    refreshToken
                }, { status: 200 })


            }

        } else {
            return NextResponse.json({
                message: "Incorrect OTP",
                success: false
            }, { status: 400 })
        }

    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 400 })
    }
}