import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.models';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();
    const reqBody = await request.json();
    const searchQuery = reqBody.search;

    

    try {

        const results = await Product.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } }).select('_id productName price images variants mrp rating');

        console.log("Results is: ", results);
        

        return NextResponse.json({
            message: "Products fetched successfully....",
            success: true,
            results
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 500 })
    }

    
}
