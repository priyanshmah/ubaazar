import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.models';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();
    try {

        const reqBody = await request.json();
        const { imageUrl, productId } = reqBody;

        if (!imageUrl || !productId) {
            return NextResponse.json({
                message: 'Image URL is required',
                success: false,
            }, { status: 400 });
        }

        const product = await Product.findById(productId);
        product.images.push(imageUrl);

        const updatedProduct = await product.save();
        

        return NextResponse.json({
            message: 'Image added successfully',
            success: true,
            img: updatedProduct.images,
        }, { status: 200 });

    } catch (error) {

        console.error('Error deleting image:', error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

