import dbConnect from "@/lib/dbConnect";
import Sarees from "@/models/products/Sarees.models";
import { NextResponse } from "next/server";
import Suits from '@/models/products/Suits&Kurtas.models';
import { AuthenticateUser } from '@/lib/authenticateUser';
import Cordset from "@/models/products/Cordset.models";
import Reel from "@/models/Reels.models";
import axios from "axios";
import Product from "@/models/Product.models";
import generateEmbedding from "@/lib/generateEmbeddings";
import { pineconeIndex } from "@/helpers/pinecone/pineconeClient";
import Lehangas from "@/models/products/Lehangas.models";
import Gown from "@/models/products/Gown.models";


export async function POST(request) {

    dbConnect();

    // const user = await AuthenticateUser(request);
    // if (!user?.isSeller) {       
    //     return NextResponse.redirect('https://www.ubaazar.com');
    // }

    try {
        const body = await request.json();
        let product;

        if (body.category === 'sarees') {

            product = await Sarees.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    error: 'Something went wrong while uploading your product'
                }, { status: 200 })
            }
        }
        else if (body.category === 'suits') {

            product = await Suits.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    error: 'Something went wrong while uploading your product',
                    success: false
                }, { status: 200 })
            }

        }
        else if (body.category === 'cordset') {

            product = await Cordset.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    message: 'Something went wrong while uploading your product',
                    success: false
                }, { status: 200 })
            }


        }
        else if (body.category === 'gown') {

            product = await Gown.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    message: 'Something went wrong while uploading your product',
                    success: false
                }, { status: 200 })
            }


        }

        else if (body.category === 'lehangas') {

            product = await Lehangas.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    message: 'Something went wrong while uploading your product',
                    success: false
                }, { status: 200 })
            }


        }

        else  {
            return NextResponse.json({
                message: 'Invalid product type',
                success: false
            }, { status: 200 })
        }

        console.log("Product created successfully", product._id);
        
        if (Array.isArray(body.video) && body.video?.length > 0) {
            await Promise.all(body.video.map(reel =>
                Reel.create({
                    videoUrl: reel,
                    products: [product._id]
                })
            ));
        }

        let productToBeUpdated = await Product.findById(product._id).select('-video').lean();
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
            { _id: product._id },
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
            id: product._id,
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
            message: "Product uploaded successfully...",
            success: true
        }, { status: 200 })

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
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