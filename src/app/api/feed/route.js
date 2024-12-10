import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";

export async function POST(request){
    await dbConnect();

    try {       
        const reqBody = await request.json();
        const { category } = reqBody;

        let products = await Product.find({ category })
        products = shuffleArray(products);

        const feed = products.map((value, _) => {
            return {
                _id: value._id,
                productName: value.productName,
                category: value.category,
                price: value.price,
                images: value.images,
                description: value.description,
                rating: value.rating
            }
        })
   
        return NextResponse.json({
            message: 'Post fetched successfully',
            success: true,
            feed: shuffleArray(feed)
        }, { status: 200})
        
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message}, { status: 500})
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
  
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }