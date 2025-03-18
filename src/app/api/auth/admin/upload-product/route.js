import dbConnect from "@/lib/dbConnect";
import Sarees from "@/models/products/Sarees.models";
import { NextResponse } from "next/server";
import Suits from '@/models/products/Suits&Kurtas.models';
import { AuthenticateUser } from '@/lib/authenticateUser';
import Cordset from "@/models/products/Cordset.models";
import Reel from "@/models/Reels.models";


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

        else {
            return NextResponse.json({ 
                message: 'Invalid product type',
                success: false
         }, { status: 200 })
        }

        if (Array.isArray(body.video) && body.video?.length > 0) {
            await Promise.all(body.video.map(reel => 
                Reel.create({
                    videoUrl: reel,
                    products: [product._id]
                })
            ));
        }
        
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
