import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";

import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    
    if (!user || !user?._id) {
        return NextResponse.json({
            message: "User not found",
            success: false
        }, { status: 403 });
    }
    
    try {
        
        const userData = await User.findById(user._id)
        .select("-refreshToken -isSeller -password")
                
        return NextResponse.json({
            message: "User data fetched successfully",
            success: true,
            user: userData
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500 })
    }

}