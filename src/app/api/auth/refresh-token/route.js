import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User.models';
import generateTokens from '@/lib/generateTokens';

export async function POST(request) {
    await dbConnect();
    const reqBody = await request.json();
    const incomingRefreshToken = reqBody.refreshToken;
    
    console.log("incoming refresh token is: ", incomingRefreshToken);
    

    if (!incomingRefreshToken) {
        return NextResponse.json({
            message: "Unauthorized access",
            success: false
        }, { status: 200 })
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )        
        const user = await User.findById(decodedToken?._id)        
        if (!user) 
            return NextResponse.json({
                message: "Invalid refresh token",
                success: false
            }, { status: 200 })
        

        if (user.refreshToken !== incomingRefreshToken) 
            return NextResponse.json({
                message: "Refresh token is expired or used",
                success: false
            }, { status: 200 })
        

        const { accessToken, refreshToken } = await generateTokens(user._id);
        if(!accessToken || !refreshToken) {
            return NextResponse.json({
                message: "Tokens not generated",
                success: false
            }, { status: 200 })
        }        

        console.log("access and refresh token are ", accessToken, "refresh :", refreshToken);
        

        const response = NextResponse.json({   
            message: "Refreshed access tokens",
            success: true,
            accessToken,
            refreshToken
        }, { status: 200 })

        return response;
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message || 'Internal server error',
            success: false
        }, { status: 200 })
    }
}
