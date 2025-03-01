import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);

    try {

        const reqBody = await request.json();
        const {
            code,
            discountType,
            discountValue,
            maxDiscount,
            minPurchase,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            description,
            applicableProducts = [],
            excludedProducts = []
        } = reqBody;

        if (!code || !discountType || !discountValue || !description)
            return NextResponse.json({
                message: "Incomplete details",
                success: false
            }, { status: 200 })

        const newCoupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            maxDiscount,
            minPurchase,
            startDate,
            endDate,
            usageLimit,
            userUsageLimit,
            description,
            applicableProducts,
            excludedProducts
        });

        if (!newCoupon)
            return NextResponse.json({
                message: "Something went wrong while creating coupon",
                success: false
            }, { status: 200 })

        return NextResponse.json({
            message: "Coupon created successfully",
            success: true
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message, success: false }, { status: 200 })
    }

}