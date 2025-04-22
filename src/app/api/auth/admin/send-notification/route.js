import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";


export async function POST(request) {

    await dbConnect();

    try {
        const reqBody = await request.json();
        const { title, body, imageUrl, token } = reqBody;

        const message = {
            token,
            data: {
                title,
                body,
            }
        };

        await admin.messaging().send(message);

        return NextResponse.json({
            message: "Notification sent successfully",
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
