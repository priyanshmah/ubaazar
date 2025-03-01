import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import BagModels from "@/models/Bag.models";
import Product from "@/models/Product.models";

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

        const productIds = user.favourites;
        let products = await Product.find({ _id: { $in: productIds } })
            .select('_id productName category price images mrp rating');

        products = products.map(product => {
            if (!product?.images?.length && product?.variants?.length) {
                product.images = product.variants[0].images;
            }
            return product;
        });

        return NextResponse.json({
            message: "User's favourites fetched successfully",
            success: true,
            favourites: products
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }

}