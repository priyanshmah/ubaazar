import Reel from '@/models/Reels.models';
import { NextResponse } from 'next/server';

export async function POST(request) {

    const reqBody = await request.json();
    const { videoUrl, products } = reqBody;

    if(!videoUrl){
        return NextResponse.json({
            message: "Video url not found",
            success: false,
        }, { status: 200 })
    }

    try {

        const newReel = await Reel.create({
            videoUrl,
            products
        }, { new: true });

        if(!newReel)
            return NextResponse.json({
                message: "Reel not added!!!",
                success: false,
            }, { status: 200 })

        return NextResponse.json({
            message: "Reel added successfully....",
            success: true,
            reel: newReel
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }
}
