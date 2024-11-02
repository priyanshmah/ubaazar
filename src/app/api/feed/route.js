import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function GET(req, res){
    await dbConnect();

    try {       

        const newPost = await Product.aggregate([
            { $sample: { size: 3}},
            { $project: {
                _id: 1,
                productName: 1,
                category: 1,
                price: 1,
                description: 1,
                images: 1
            }},
            
        ]);
        const feed = newPost.map((value, _) => {
            return {
                _id: value._id,
                productName: value.productName,
                category: value.category,
                price: value.price,
                images: value.images,
                description: value.description
            }
        })
   
        return NextResponse.json({
            message: 'Post fetched successfully',
            feed
        }, { status: 200})
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message}, { status: 500})
    }
}