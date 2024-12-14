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

        if (!productId || !data || !category) {
            return NextResponse.json({
                message: "Data not found",
                success: false
            }, { status: 400 })
        }

        let updatedProduct;
        const product = await Product.findById(productId);

        if(!product) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 400 })
        }

        if (category === 'sarees') 
            updatedProduct = await Sarees.hydrate(product);

        else if (category === 'suits') 
            updatedProduct = await Suits.hydrate(product);  
        
        else return NextResponse.json({
                message: "No category exist for this",
                success: false
            }, { status: 404 })
        

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                updatedProduct[key] = data[key];
            }
        });

        await updatedProduct.save();

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
            message: 'Something went wrong while updating the product',
            success: false
        }, { status: 500 })
    }

} 