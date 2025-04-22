import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import axios from "axios";

import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    // const user = await AuthenticateUser(request);
    // if (!user || !user._id)
    //     return NextResponse.json({
    //         message: "User credentials not found or expired",
    //         success: false
    //     }, { status: 403 })


    try {

        const reqBody = await request.json();
        const { productId } = reqBody;

        if (!productId ) {
            return NextResponse.json({
                message: "Details not found",
                success: false
            }, { status: 200 })
        }

        const productToBeDeleted = await Product.findById(productId).lean();
        if (!productToBeDeleted ) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 200 })
        }

        const deleteResponse = await axios.post(
            'http://www.ubaazar.com/api/auth/admin/products/delete-image', {
            imageUrls: productToBeDeleted.images || [],
        })

        if (!deleteResponse.data.success) {
            return NextResponse.json({
                message: 'Failed to delete images from Cloudinary',
                success: false
            }, { status: 200 })
        }

        const isProductDeleted = await Product.deleteOne({ _id: productId });
        if (!isProductDeleted) {
            return NextResponse.json({
                message: "Product not deleted from database",
                success: false
            }, { status: 200 })
        }

     
        return NextResponse.json({
            message: "Product deleted successfully",
            success: true
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}