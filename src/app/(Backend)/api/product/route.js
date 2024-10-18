import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function POST(req, res){
    await dbConnect();

    try {

        const { productId } = await req.json();
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return NextResponse.json({
                error: 'Product not found'
            }, {status: 404})
        }
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