import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";
import axios from "axios";

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

        if (!userData) {
            return NextResponse.json({
                message: "User data not available",
                success: false,
            }, { status: 200 })
        }

        let orders = [];

        if(userData.previousOrders?.length){

            console.log("sending request");
            

        const response = await axios.post(`https://www.ubaazar.com/api/orders`, JSON.stringify({
            orderIds: userData.previousOrders
        }));
        orders = response.data?.orders
    }
        
                
        return NextResponse.json({
            message: "Orders data fetched successfully",
            success: true,
            orders
        }, { status: 200 })
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}