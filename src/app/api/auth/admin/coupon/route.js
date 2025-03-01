import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    // if (!user?.isSeller) {       
    //     return NextResponse.redirect('https://www.ubaazar.com');
    // }

    try {

        const reqBody = await request.json();
       

        return NextResponse.json({
            success: true,
        })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}