import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {

        let products = await Product.find({
            variants: { $exists: true, $ne: [] }
        })
        .select('_id productName price rating variants images mrp')
        .sort({ createdAt: -1 })
        .lean();

        products.forEach((product) => {
            product.variants = product.variants.map((variant) => {
                return {
                    variantId: variant._id,
                    image: variant.images[0],
                };
            })

        });

        return NextResponse.json({
            message: 'Post fetched successfully',
            success: true,
            feed: products,
        }, { status: 200 })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 200 })
    }
}
