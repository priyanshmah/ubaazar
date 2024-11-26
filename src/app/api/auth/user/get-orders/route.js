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
        }, { status: 404 });
    }
    
    try {
        
        const userData = await User.findById(user._id)
        .select("-refreshToken -isSeller -password")

        if (!userData) {
            return NextResponse.json({
                message: "User data not available",
                success: false,
            }, { status: 400 })
        }

        userData.previousOrders = await Order.find(
            { _id: { $in: userData.previousOrders}}
        )

        for (let order of userData.previousOrders) {

            let productIds = order?.products?.map((value) => value.product);
            let productInfo = await Product.find({ _id: { $in: productIds } }).select("_id productName images");

            const address = await Address.findById(order.address);

            order.address = address;
            order.products = order.products.map((product) => {
                const detailedProduct = productInfo.find(p => p._id.toString() === product.product.toString());
                return { ...product, product: detailedProduct };
            });

        }
                
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