import { pineconeIndex } from "@/helpers/pinecone/pineconeClient";
import dbConnect from "@/lib/dbConnect";
import generateEmbedding from "@/lib/generateEmbeddings";
import Product from "@/models/Product.models";
import { NextResponse } from "next/server";


export async function POST(request) {
    await dbConnect();

    try {
        
        const reqBody = await request.json();
        const { productId } = reqBody;

        if (!productId) {
            return NextResponse.json({
                message: "Product ID not found",
                success: false
            }, { status: 200 })
        }

        let productToBeUpdated = await Product.findById(productId).select('-video').lean();
        if (!productToBeUpdated) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 200 })
        }

        const embeddings = await generateEmbedding(
            productToTextEmbeddingGeneral(productToBeUpdated)
        );

       const updatedProduct = await Product.updateOne(
            { _id: productId },
            { embeddings: embeddings },
            { new: true }
        );
        if (!updatedProduct) {
            return NextResponse.json({
                message: "Product not updated",
                success: false
            }, { status: 200 })
        }


        await pineconeIndex.upsert([{
            id: productId,
            values: embeddings,
            metadata: {
                productName: productToBeUpdated.productName,
                category: productToBeUpdated.category,
                price: productToBeUpdated.price,
                mrp: productToBeUpdated.mrp,
                rating: productToBeUpdated.rating,
                isTrending: productToBeUpdated.isTrending,
            }
        }]);
        

        return NextResponse.json({
            message: 'Products data fetched successfully',
            success: true,
            updatedProduct,
        }, { status: 200 })



    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 200 })
    }

}

function productToTextEmbeddingGeneral(product) {
    const excludedFields = ['_id', '__v', 'video', 'images', 'createdAt', 'updatedAt', 'type', 'embeddings'];
  
    let result = [];
  
    for (let key in product) {
      if (excludedFields.includes(key)) continue;
  
      const value = product[key];
  
      // Handle array of variants
      if (key === 'variants' && Array.isArray(value)) {
        const colors = value.map(v => v.color?.trim()).filter(Boolean).join(', ');
        if (colors) result.push(`Color Variants: ${colors}`);
        continue;
      }
  
      // For nested objects or arrays, skip or handle specially
      if (typeof value === 'object') continue;
  
      if (value !== undefined && value !== null && typeof value !== 'object') {
        const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        result.push(`${readableKey}: ${String(value).trim()}`);
      }
    }
  
    return result.join(' ');
  }
  


  