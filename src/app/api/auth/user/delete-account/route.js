import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.models";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);

    if (!user || !user?._id) {
        return NextResponse.json({
            message: "User not found",
            success: false
        }, { status: 403 });
    }

    try {

        const response = await User.findByIdAndDelete(user._id);

        if (!response)
            return NextResponse.json({
                message: "Account not deleted",
                success: false,
            }, { status: 200 })
      

        return NextResponse.json({
            message: "Account deleted",
            success: true,
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}