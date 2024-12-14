import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models.js";
import { NextResponse } from "next/server";

export async function POST(request){
    await dbConnect();

    try {

        const { productId } = await request.json();
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({
                error: 'Product not found'
            }, {status: 404})
        }
        console.log("product is: ", product);
        
        return NextResponse.json({
            message: "Product data fetched successfully...",
            success: true,
            product
        }, { status: 200 })
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message}, { status: 500})
    }
}