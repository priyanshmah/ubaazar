import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import BagModels from "@/models/Bag.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";

import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    if (!user || !user._id) 
        return NextResponse.json({
            message: "User credentials not found or expired",
            success: false
        }, { status: 403 })
    

    try {

        const reqBody = await request.json();
        const { productId } = reqBody;
       
        if (!productId) {
            return NextResponse.json({
                message: "Details not found",
                success: false
            }, { status: 200 })
        }

        const productToBeRemoved = await Product.findById(productId);        
        if (!productToBeRemoved) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 200 })
        }

        let userBag = await BagModels.findOne({ user: user._id });
        console.log("user Bag is: ", userBag);
        
        if (userBag) {
            const newBag = userBag.items.filter(item => item.product.toString() !== productId);
                        
            userBag.items = newBag;
            console.log("new bag is: ", newBag);
            
            await userBag.save();
        } 

        const productIds = userBag.items?.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } })
            .select('_id productName images category price mrp variants');

        const itemsWithDetails = userBag.items?.map(item => {
            
            let product = products.find(
                prod => prod._id.toString() === item.product.toString()
            ).toObject();

            product.variant = product.variants?.find(
                variant => variant._id.toString() === item.variantId.toString()
            );
            
            const trimmedVariant = {
                color: product.variant?.color || '',
                image: product.variant?.images?.at(0) || product.images.at(0)
            }
            product.variant = trimmedVariant;
            let { variants, images, ...trimmedProduct} = product
           
            return {
                ...item.toObject(),
                product: trimmedProduct
            };
        });

        return NextResponse.json({
            message: "Deleted from bag successfully",
            success: true,
            bag: {
                ...userBag.toObject(),
                items: itemsWithDetails
            },
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }

}