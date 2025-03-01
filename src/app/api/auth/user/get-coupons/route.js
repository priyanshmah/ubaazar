import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon.models";
import Product from "@/models/Product.models";
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

        const couponIds = user.coupons;
        let coupons = await Coupon.find({ _id: { $in: couponIds } })
            .select('_id code discountType discountValue maxDiscount minPurchase description');

        return NextResponse.json({
            message: "User's coupons fetched successfully",
            success: true,
            coupons
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }

}