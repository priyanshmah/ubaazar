import { pineconeIndex } from '@/helpers/pinecone/pineconeClient';
import dbConnect from '@/lib/dbConnect';
import generateEmbedding from '@/lib/generateEmbeddings';
import Product from '@/models/Product.models';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();

    const reqBody = await request.json();
    const { query } = reqBody;

    if (!query) {
        return NextResponse.json({
            message: "Search query not found",
            success: false,
        }, { status: 200 })
    }

    console.log("query", query);
    

    try {

        const searchQuery = query?.trim()?.toLowerCase();
        const embeddings = await generateEmbedding(searchQuery);

        if (!embeddings) {
            return NextResponse.json({
                message: "Embeddings not generated",
                success: false,
            }, { status: 200 })
        }

        const results = await pineconeIndex.query({
            vector: embeddings,
            topK: 100,
            includeMetadata: true
        })

        console.log("results", results);
        

        const matches = results.matches || [];
        const SCORE_THRESHOLD = 0.50;

        const goodMatches = matches.filter((match) => match.score >= SCORE_THRESHOLD);



        if (goodMatches.length > 0) {
            const ids = goodMatches.map((m) => m.id);
            const products = await Product.find({ _id: { $in: ids } })
                .select('_id productName price category variants mrp rating isTrending')
                .lean();

            const results = products.map((product) => {
                const score = goodMatches.find((m) => m.id === product._id.toString())?.score;
                return {
                    _id: product._id,
                    productName: product.productName,
                    price: product.price,
                    category: product.category,
                    image: product.variants[0]?.images[0],
                    mrp: product.mrp,
                    rating: product.rating,
                    isTrending: product.isTrending,
                    fallback: false,
                    score
                };
            });

            return NextResponse.json({
                message: "Products fetched successfully....",
                success: true,
                results
            }, { status: 200 })
        }

        const fallbackIds = results.matches.map(match => match.id);
        const fallbackProducts = await Product.find({ _id: { $in: fallbackIds } })
            .select('_id productName price category variants mrp rating isTrending')
            .lean();
        const fallbackResults = fallbackProducts.map((product) => {
            return {
                _id: product._id,
                productName: product.productName,
                price: product.price,
                category: product.category,
                image: product.variants[0]?.images[0],
                mrp: product.mrp,
                rating: product.rating,
                isTrending: product.isTrending,
                fallback: true
            };
        })

        return NextResponse.json({
            message: "No strong match found. Showing similar items instead",
            success: true,
            results: fallbackResults
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 500 })
    }
}
