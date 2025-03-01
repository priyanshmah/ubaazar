import { AuthenticateUser } from "@/lib/authenticateUser";
import dbConnect from "@/lib/dbConnect";
import Address from "@/models/Address.models";
import Order from "@/models/Order.models";
import Product from "@/models/Product.models";
import User from "@/models/User.models";
import axios from "axios";

import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    const user = await AuthenticateUser(request);

    if (!user || !user?._id) {
        return NextResponse.json({
            message: "User not found",
            success: false
        }, { status: 403 });
    }

    try {

        const reqBody = await request.json();
        let {
            area,
            name,
            pincode,
            address,
            isDefault,
            addressType,
            mobileNumber } = reqBody;

            console.log("reqBody is: ", area, name, pincode, mobileNumber, address);
            

        let city = '';
        let state = '';

        if (!area || !name || !pincode || !address || !mobileNumber) {
            return NextResponse.json({
                message: "User details not found",
                success: false
            }, { status: 200 });
        }

        const pinResponse = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
        );

        if (pinResponse.data.at(0).PostOffice.length > 0) {
            city = pinResponse.data.at(0).PostOffice.at(0).District
            state = pinResponse.data.at(0).PostOffice.at(0).State
        }

        if (isDefault)
            await Address.updateMany(
                { _id: { $in: user.savedAddresses } }, 
                { $set: { isDefault: false } } 
            );
        
        
        if (!user.savedAddresses?.length) isDefault = true

        const newAddress = await Address.create({
            area,
            name,
            pincode,
            address,
            isDefault,
            addressType,
            mobileNumber,
            city,
            state,
            isDefault
        });
        if (!newAddress) {
            return NextResponse.json({
                message: "Address not added",
                success: false,
            }, { status: 200 });
        }
        

        user.savedAddresses.push(newAddress._id);
        await user.save({ new: true });

        return NextResponse.json({
            message: "New address added",
            success: true,
            address: newAddress
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }

}