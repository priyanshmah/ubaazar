import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.models';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    await dbConnect();

    try {

        const reqBody = await request.json();
        const { imageUrl, productId } = reqBody;

        if (!imageUrl || !productId) {
            return NextResponse.json({
                    message: 'Image URL is required',
                    success: false,
                },{ status: 400 });
        }

        const publicId = extractPublicId(imageUrl);
        const product = await Product.findById(productId);

        if (!publicId || !product) {
            return NextResponse.json({
                    message: 'Invalid Cloudinary URL or Product Id',
                    success: false,
                },{ status: 400 });
        }
       
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok') {
            return NextResponse.json({
                    message: 'Failed to delete image from Cloudinary',
                    success: false,
                    result,
                },{ status: 500 });
        }

        product.images = product.images?.filter((value) => {
            return value !== imageUrl;
        })

        const updatedProduct = await product.save();

        return NextResponse.json({
                message: 'Image deleted successfully',
                success: true,
                images : updatedProduct.images,
            },{ status: 200 });

    } catch (error) {

        console.error('Error deleting image:', error);
        return NextResponse.json({
                message: 'Internal server error',
                success: false,
                error: error.message,
            },{ status: 500 });
    }
}

function extractPublicId(imageUrl) {
    try {
        const urlSegments = imageUrl.split('/');
        const fileName = urlSegments.pop();
        const publicId = `${fileName}`.split('.')[0];

        return publicId;

    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}
