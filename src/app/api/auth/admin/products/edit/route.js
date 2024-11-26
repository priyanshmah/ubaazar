import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import Sarees from "@/models/products/Sarees.models";
import Suits from "@/models/products/Suits&Kurtas.models";
import { NextResponse } from "next/server";

export async function POST(request) {

    await dbConnect();

    try {

        const reqBody = await request.json();
        const { productId, data, category } = reqBody;

        if(!productId || !data || !category){
            return NextResponse.json({
                message: "Data not found",
                success: false
            }, { status: 404 })
        }

        let updatedProduct;

        if (category === 'sarees') {
            updatedProduct = await Sarees.findByIdAndUpdate(
                productId,
                data,
                { new: true }
            );

        } 
        else if (category === 'suits') {
            updatedProduct = await Suits.findByIdAndUpdate(
                productId,
                data,
                { new: true }
            );
        } 
        else {
            return NextResponse.json({
                message: "No category exist for this",
                success: false
            }, { status: 404 })
        }

        if (!updatedProduct) {
            return NextResponse.json({
                message: "Product not updated",
                success: false
            }, { status: 401 })
        }

        return NextResponse.json({
            message: "Product updated successfully",
            success: true,
            product: updatedProduct
        }, { status: 200 })

        
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: 'Somenthing went wrong while updating the product',
            success: false
        }, { status: 500 })
    }
    
} 