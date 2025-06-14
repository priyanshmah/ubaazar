import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.models";

import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);
    if (!user || !user?._id) {
        return NextResponse.json({
            message: "Unauthorised access",
            success: false
        }, { status: 403 });
    }

    try {

        console.log("request received");
        const reqBody = await request.json();
        const { username, email, mobileNumber, bag, previousOrders, favourites, savedAddresses } = reqBody;

        if (
            !savedAddresses &&
            !previousOrders &&
            !mobileNumber &&
            !favourites &&
            !username &&
            !email &&
            !bag
        ) {
            return NextResponse.json({
                message: "Details not found",
                success: false
            }, { status: 200 })
        }

        const detailsToBeUpdated = {
            bag,
            email,
            username,
            favourites,
            mobileNumber,
            previousOrders,
            savedAddresses
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            detailsToBeUpdated
        )

        if (!updatedUser) {
            return NextResponse.json({
                message: "Details not updated",
                success: false
            }, { status: 200 })
        }

        const updatedUserDetails = await User.findById(updatedUser._id)
            .select("-isSeller -password -refreshToken")

        return NextResponse.json({
            message: "User data updated successfully",
            success: true,
            user: updatedUserDetails
        }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}