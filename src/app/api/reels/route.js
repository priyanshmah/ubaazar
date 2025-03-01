import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.models';
import Reel from '@/models/Reels.models';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    try {

        const reels = await Reel.find({}).sort({ createdAt: -1 }).lean();
        const productIds = reels.flatMap((value) => value.products);

        console.log("productIds: ", productIds);


        const productData = await Product.find({
            _id: { $in: productIds }
        }).select('variants productName price mrp').lean()

        const productMap = productData.reduce((acc, product) => {
            acc[product._id.toString()] = product;
            return acc;
        }, {});

        const updatedReels = reels.map(reel => ({
            ...reel,
            products: reel.products.map(productId => productMap[productId] || null) 
        }));

        return NextResponse.json({
            message: "Reel fetched successfully....",
            success: true,
            reels: updatedReels
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }
}
