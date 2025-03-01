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
        const { imageUrls, productId } = reqBody;

        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return NextResponse.json({
                message: 'Image URLs are required and should be an array',
                success: false,
            }, { status: 200 });
        }

        const product = await Product.findById(productId);
        const publicIds = imageUrls.map(extractPublicId).filter(id => id);

        if (publicIds.length === 0) {
            return NextResponse.json({
                message: 'Invalid Cloudinary URLs',
                success: false,
            }, { status: 200 });
        }

         const deleteResults = await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));

         const successfullyDeleted = publicIds.filter((id, index) => deleteResults[index].result === 'ok');
 
         if (successfullyDeleted.length === 0) {
             return NextResponse.json({
                 message: 'Failed to delete images from Cloudinary',
                 success: false,
             }, { status: 200 });
         }
       
        return NextResponse.json({
                message: 'Image deleted successfully',
                success: true,
            },{ status: 200 });

    } catch (error) {

        console.error('Error deleting image:', error);
        return NextResponse.json({
                message: 'Internal server error',
                success: false,
                error: error.message,
            },{ status: 200 });
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
