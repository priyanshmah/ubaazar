import dbConnect from "@/lib/dbConnect";
import Reel from "@/models/Reels.models";
import { NextResponse } from "next/server";


export async function POST(request) {

    dbConnect();

    // const user = await AuthenticateUser(request);
    // if (!user?.isSeller) {       
    //     return NextResponse.redirect('https://www.ubaazar.com');
    // }

    try {
        const reqBody = await request.json();
        const { videoUrl, productIds } = reqBody;

        if (!videoUrl) {
            return NextResponse.json({
                message: 'Invalid product type',
                success: false
            }, { status: 200 })
        }

        const newReel = await Reel.create({
            videoUrl,
            products: productIds
        });

        if (!newReel) {
            return NextResponse.json({ 
                message: 'Reel not saved to database',
                success: false
         }, { status: 200 })
        }


        return NextResponse.json({
            message: 'Reel saved to database successfully...',
            success: true
        }, { status: 200 })

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 500 })
    }
}
