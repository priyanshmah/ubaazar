import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";

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
                message: "ProductId not found",
                success: false
            }, { status: 200 })
        }

        const productToBeAdded = await Product.findById(productId);
        if (!productToBeAdded) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 200 })
        }

        const existingItem = user.favourites.find(
            item => item.toString() === productId
        );
        if (existingItem)
            return NextResponse.json({
                message: "Already in favourites",
                success: true
            }, { status: 200 })

        user.favourites.push(productId);
        await user.save();

        const productIds = user.favourites;
        let products = await Product.find({ _id: { $in: productIds } })
            .select('_id productName category price images mrp rating');

        products = products.map(product => {
            if (!product.images.length && product.variants.length) {
                product.images = product.variants[0].images;
            }
            return product;
        });

        return NextResponse.json({
            message: "Added to favourites successfully",
            success: true,
            favourites: products
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}