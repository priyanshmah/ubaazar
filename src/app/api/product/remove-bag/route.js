import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import BagModels from "@/models/Bag.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";

import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    if (!user || !user._id) 
        return NextResponse.json({
            message: "User credentials not found or expired",
            success: false
        }, { status: 403 })
    

    try {

        const reqBody = await request.json();
        const { productId } = reqBody;

        if (!productId) {
            return NextResponse.json({
                message: "Details not found",
                success: false
            }, { status: 200 })
        }

        const productToBeRemoved = await Product.findById(productId);        
        if (!productToBeRemoved) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 200 })
        }

        let bag = await BagModels.findOne({ user: user._id });
        if (bag) {
            const newBag = bag.items.filter(item => item.product.toString() !== productId);
                        
            bag.items = newBag;
            await bag.save();
        } 

        return NextResponse.json({
            message: "Deleted from bag successfully",
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }

}