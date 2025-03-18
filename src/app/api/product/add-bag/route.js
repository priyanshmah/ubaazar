import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import BagModels from "@/models/Bag.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";
import mongoose from "mongoose";

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
        const { productId, variantId, quantity, size } = reqBody;

        if (!productId || !quantity ) {
            return NextResponse.json({
                message: "Details not found",
                success: false
            }, { status: 200 })
        }


        const productToBeAdded = await Product.findById(productId).lean();
        const variant = productToBeAdded?.variants?.find(value => value._id.toString() === variantId)
        const isSizeAvailable = variant?.sizes?.find((value) => value.size === size)       

        if (!productToBeAdded ) {
            return NextResponse.json({
                message: "Product or variant not found",
                success: false
            }, { status: 200 })
        }

        if (size && !isSizeAvailable) {
            return NextResponse.json({
                message: "Size not available",
                success: false
            }, { status: 200 })
        }

        console.log("Adding to bag");
        

        let bag = await BagModels.findOne({ user: user._id });
        if (bag) {

            const existingItem = bag?.items?.find(
                item => (item.product.toString() === productId && item.variantId.toString() === variantId)
            );
            if (existingItem)
                existingItem.quantity += 1;

            

            else bag.items.push({ product: productId, quantity, variantId, size });
            await bag.save();

        } else {
            bag = await BagModels.create({
                user: user._id,
                items: [{ product: productId, quantity, variantId }]
            });

            if (!bag) {
                return NextResponse.json({
                    message: "Internal Server error while creating bag",
                    success: false
                }, { status: 200 })
            }
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { bag: bag._id }
            );
            if (!updatedUser) {
                return NextResponse.json({
                    message: "User not updated",
                    success: false
                }, { status: 200 })
            }
        }

        const productIds = bag.items?.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } })
            .select('_id productName images category price mrp variants');

        const itemsWithDetails = bag.items?.map(item => {
            
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
            message: "Added to bag successfully",
            success: true,
            bag: {
                ...bag.toObject(),
                items: itemsWithDetails
            },
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}