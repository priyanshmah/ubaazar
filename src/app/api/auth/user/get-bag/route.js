import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import BagModels from "@/models/Bag.models";
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

        const userBag = await BagModels.findById(user.bag);
        if (!userBag) {
            return NextResponse.json({
                message: "User's Bag data not available",
                success: false,
            }, { status: 200 })
        }

        const productIds = userBag.items?.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } })
            .select('_id productName category price mrp variants');

        const itemsWithDetails = userBag.items?.map(item => {
            
            let product = products.find(prod => prod._id.toString() === item.product.toString()).toObject();
            product.variant = product.variants?.find(variant => variant._id.toString() === item.variantId.toString());
            const trimmedVariant = {
                color: product.variant.color,
                image: product.variant.images.at(0)
            }
            product.variant = trimmedVariant;
            let { variants, ...trimmedProduct} = product
           
            return {
                ...item.toObject(),
                product: trimmedProduct
            };
        });

        return NextResponse.json({
            message: "User's Bag data fetched successfully",
            success: true,
            bag: {
                ...userBag.toObject(),
                items: itemsWithDetails
            },
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}