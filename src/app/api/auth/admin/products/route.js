import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";


export async function POST(request) {
    await dbConnect();
    // const user = await AuthenticateUser(request);

    try {
        console.log("request received");
        

        const reqBody = await request.json();
        const { page, limit, category, filter = {} } = reqBody;
        const skip = (page - 1) * limit;

        if (!page || !category) {
            return NextResponse.json({
                message: 'Missing data',
                success: false
            }, { status: 404 })
        }

        

        const products = await Product.find({ category ,...filter }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!products) {
            return NextResponse.json({
                message: 'Something went wrong while fetching data',
                success: false
            }, { status: 401 })
        }
        const shuffledProducts = shuffleArray(products);
        let totalProducts = await Product.countDocuments({ category })

        return NextResponse.json({
            message: 'Products data fetched successfully',
            success: true,
            totalProducts,
            products: shuffledProducts
        }, { status: 200 })



    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }
  