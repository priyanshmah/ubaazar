import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";

const db = admin.firestore()

export async function POST(request) {
    await dbConnect();

    try {
        const reqBody = await request.json();
        const { category } = reqBody;

        let products;

        if (category !== 'all') products = await Product.find({ category }).lean();
        else products = await Product.find().lean().limit(20);

        products = shuffleArray(products);

        let trendingProducts = await Product.find({ isTrending: true })
            .select('_id productName price rating variants images mrp').lean();
        trendingProducts = shuffleArray(trendingProducts);

        trendingProducts = trendingProducts.flatMap((product) => {
            return product.variants.map((variant) => {
                return {
                    _id: product._id,
                    productName: product.productName,
                    price: product.price,
                    rating: product.rating,
                    variantId: variant._id,
                    image: variant.images[0],
                };
            });
        });


        const feed = products.map((value, _) => {

            return {
                _id: value._id,
                productName: value.productName,
                price: value.price,
                images: value.images || value?.variants?.at(0)?.images,
                mrp: value.mrp || Math.floor(value.price * 1.5),
                rating: value.rating || 4.0,
                category: value.category,
                type: value.occasion
            }
        })

        // const snapshots = await db.collection('banners').get();        
        // const banners = snapshots.docs.map((doc) => doc.data());
        // console.log('Banners: ', banners);
        
        return NextResponse.json({
            message: 'Post fetched successfully',
            success: true,
            feed: shuffleArray(feed),
            trendingProducts: shuffleArray(trendingProducts),
            // banners: banners
        }, { status: 200 })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 200 })
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}