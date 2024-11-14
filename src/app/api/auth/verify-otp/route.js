import dbConnect from "@/lib/dbConnect";
import OTPModels from "@/models/OTP.models";
import User from "@/models/User.models";
import axios from "axios";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId);

        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )
        const refreshToken = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                mobileNumber: user.mobileNumber
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )

        await User.findByIdAndUpdate(
            userId,
            { refreshToken }
        )

        return { accessToken, refreshToken }

    } catch (error) {
        return { accessToken: null, refreshToken: null }
    }
}

export async function POST(req) {

    await dbConnect();
    const reqBody = await req.json();
    const { mobileNumber, enteredOTP } = reqBody;

    if (!mobileNumber || !enteredOTP) {
        return NextResponse.json(
            { message: "Mobile number or OTP not found" },
            { status: 404 }
        )
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const otpRecord = await OTPModels.findOne({ mobileNumber }).session(session);

        console.log("OTP found...");
        

        if (!otpRecord) {
            await session.abortTransaction();
            session.endSession();

            return NextResponse.json(
                { error: "OTP expired" },
                { status: 400 }
            )
        }

        
        const expiryDate = new Date(otpRecord.expiresIn).getTime();
        
        if (Date.now() > expiryDate) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json(
                { error: "OTP expired" },
                { status: 400 }
            )
        }

        if (otpRecord.verificationCode == enteredOTP) {
            await OTPModels.deleteOne({ mobileNumber }).session(session);

            console.log("otp verified");
            
            let accessToken;
            let newUser = false;
            const existedUser = await User.findOne({ mobileNumber }).session(session);

            console.log("existed user" , existedUser);
            
            if (existedUser) {
                ({ accessToken } = await generateAccessAndRefreshTokens(existedUser._id));

            } else {
                const signupUser = await User.create([{
                    mobileNumber,
                    username: mobileNumber,
                    email: ''
                }], { session })

                if (!signupUser) {
                    return NextResponse.json({ message: 'something went wrong'})
                }

                ({ accessToken } = await generateAccessAndRefreshTokens(signupUser._id));

                newUser = true;
            }


            const response = NextResponse.json(
                {   message: "OTP verified successfully",
                    newUser 
                }, { status: 200 }
            )

            response.cookies.set("token", accessToken, {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            })

            await session.commitTransaction();
            session.endSession();

            return response;

        } else {

            await session.abortTransaction();
            session.endSession();

            return NextResponse.json(
                { error: "Incorrect OTP" },
                { status: 400 }
            )
        }

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}