import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import User from "@/models/User.models";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const user = await AuthenticateUser(request);
        const userId = user?._id;


        const reqBody = await request.json();
        let {
            area,
            name,
            pincode,
            address,
            isDefault,
            addressType,
            mobileNumber,
        } = reqBody;

        // Validate required fields
        if (!area || !name || !pincode || !address || !mobileNumber) {
            return NextResponse.json({
                message: "All required fields must be provided",
                success: false
            }, { status: 200 });
        }


        let city = '';
        let state = '';

        try {
            const pinResponse = await axios.get(
                `https://api.postalpincode.in/pincode/${pincode}`
            );

            if (pinResponse.data.at(0).PostOffice.length > 0) {
                city = pinResponse.data.at(0).PostOffice.at(0).District;
                state = pinResponse.data.at(0).PostOffice.at(0).State;
            } else {
                return NextResponse.json({
                    message: "Invalid pincode",
                    success: false
                }, { status: 200 });
            }
        } catch (error) {
            return NextResponse.json({
                message: "Error validating pincode",
                success: false
            }, { status: 200 });
        }



        if (userId && isDefault && user.savedAddresses?.length)
            await Address.updateMany(
                { _id: { $in: user.savedAddresses } },
                { $set: { isDefault: false } }
            );


        if (userId &&!user.savedAddresses?.length) isDefault = true



        // Create new address
        const newAddress = await Address.create({
            area,
            name,
            pincode,
            address,
            isDefault: isDefault || false,
            addressType,
            mobileNumber,
            city,
            state,
            userId: userId || null // Store userId if provided, otherwise null
        });

        if (!newAddress) {
            return NextResponse.json({
                message: "Failed to create address",
                success: false
            }, { status: 200 });
        }

        if (userId) {
            user.savedAddresses.push(newAddress._id);
            await user.save({ new: true });
        }

        return NextResponse.json({
            message: "Address added successfully",
            success: true,
            address: newAddress
        }, { status: 200 });

    } catch (error) {
        console.error("Address addition error:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, { status: 200 });
    }
}