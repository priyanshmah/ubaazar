import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";


export async function POST(request) {
    await dbConnect();
    const user = await AuthenticateUser(request);

    try {

        const reqBody = await request.json();
        const { page, limit, category } = reqBody;
        const skip = (page - 1) * limit;

        if (!page || !limit || !category) {
            return NextResponse.json({
                message: 'Missing data',
                success: false
            }, { status: 404 })
        }

        const products = await Product.find({ category }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!products) {
            return NextResponse.json({
                message: 'Something went wrong while fetching data',
                success: false
            }, { status: 401 })
        }

        return NextResponse.json({
            message: 'Products data fetched successfully',
            success: true,
            products
        }, { status: 200 })



    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}