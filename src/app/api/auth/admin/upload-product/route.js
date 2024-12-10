import dbConnect from "@/lib/dbConnect";
import Sarees from "@/models/products/Sarees.models";
import { NextResponse } from "next/server";
import Suits from '@/models/products/Suits&Kurtas.models';
import { AuthenticateUser } from '@/lib/authenticateUser';
import Cordset from "@/models/products/Cordset.models";


export async function POST(request) {

    dbConnect();

    // const user = await AuthenticateUser(request);
    // if (!user?.isSeller) {       
    //     return NextResponse.redirect('https://www.ubaazar.com');
    // }

    try {
        const body = await request.json();

        console.log(body.productCategoryData);


        if (body.category === 'sarees') {
            console.log("start");

            const product = await Sarees.create({ ...body, ...body?.productCategoryData });

            console.log("end");

            if (!product) {
                return NextResponse.json({
                    error: 'Something went wrong while uploading your product'
                }, { status: 400 })
            }
            return NextResponse.json({
                message: "Product uploaded successfully...",
                success: true
            }, { status: 200 })
        }
        else if (body.category === 'suits') {

            const product = await Suits.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    error: 'Something went wrong while uploading your product'
                }, { status: 400 })
            }
            return NextResponse.json({
                message: "Product uploaded successfully...",
                success: true
            }, { status: 200 })

        }
        else if (body.category === 'cordset') {

            const product = await Cordset.create({ ...body, ...body?.productCategoryData });
            if (!product) {
                return NextResponse.json({
                    message: 'Something went wrong while uploading your product',
                    success: false
                }, { status: 400 })
            }
            return NextResponse.json({
                message: "Product uploaded successfully...",
                success: true
            }, { status: 200 })

        }

        else {
            return NextResponse.json({ 
                message: 'Invalid product type',
                success: false
         }, { status: 400 })
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({
             message: error.message || "Internal server error",
             success: false
        }, { status: 500 })
    }
}
