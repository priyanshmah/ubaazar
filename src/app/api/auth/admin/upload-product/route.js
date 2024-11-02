import multer from 'multer';
import dbConnect from "@/lib/dbConnect";
import Sarees from "@/models/products/Sarees.models";
import { NextResponse } from "next/server";
import { createRouter } from 'next-connect'
import Cloudinary, { uploadImages } from '@/helpers/cloudinary';
import Suits from '@/models/products/Suits&Kurtas.models';


export async function POST(req, res) {

    dbConnect();
    const body = await req.json();
    console.log(body);


    try {
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

            const product = await Suits.create({ ...body });
            if (!product) {
                return NextResponse.json({
                    error: 'Something went wrong while uploading your product'
                }, { status: 400 })
            }
            return NextResponse.json({
                message: "Product uploaded successfully...",
                success: true
            }, { status: 200 })

        } else {
            return NextResponse.json(
                { error: 'Invalid product type' }, { status: 400 })
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: error.message }, { status: 500 }
        )
    }
}
