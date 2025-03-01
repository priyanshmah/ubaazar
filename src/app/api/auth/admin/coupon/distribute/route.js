import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon.models";
import User from "@/models/User.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {

        const reqBody = await request.json();
        const { userIds = [], couponCode } = reqBody

        if (!Array.isArray(userIds) || !couponCode)
            return NextResponse.json({
                message: "Missing data!!!",
                success: false
            }, { status: 200 })

        const coupon = await Coupon.findOne({ code: couponCode });
        if (!coupon)
            return NextResponse.json({
                message: "Coupon not found",
                success: false
            }, { status: 200 })

        let result;

        if (userIds.length > 0) {
            result = await User.updateMany(
                { _id: { $in: userIds }, coupons: { $ne: coupon._id } },
                { $push: { coupons: coupon._id } }
            );
        } else {
            result = await User.updateMany(
                { coupons: { $ne: coupon._id } },
                { $push: { coupons: coupon._id } }
            );
        }

        if (!result)
            return NextResponse.json({
                message: "Something went wrong while distribution",
                success: false
            }, { status: 200 })


        return NextResponse.json({
            message: "Coupon distributed successfully!!!",
            success: true
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message, success: false }, { status: 200 })
    }

}