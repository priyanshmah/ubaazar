import dbConnect from "@/lib/dbConnect";
import FcmTokenModels from "@/models/FcmToken.models";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {
        const reqBody = await request.json();
        const { fcmToken, deviceId, userId } = reqBody;

        if (!fcmToken) {
            return NextResponse.json({
                message: 'FCM token is required',
                success: false
            }, { status: 200 })
        }

        if (!deviceId ) {
            return NextResponse.json({
                message: 'DeviceId is required',
                success: false
            }, { status: 200 })
        }

        console.log("FCM token: ", fcmToken);
        console.log("DeviceId: ", deviceId);
        
        let updateData = {
            fcmToken,
            lastActive: new Date(),
            deviceInfo: {
                platform: reqBody.platform || null,
                model: reqBody.model || null,
                osVersion: reqBody.osVersion || null
            }
        }

        if (userId) updateData.userId = userId;
        
        const newFcmToken = await FcmTokenModels.findOneAndUpdate(
            { deviceId },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!newFcmToken) {
            return NextResponse.json({
                message: 'Failed to save FCM token',
                success: false
            }, { status: 200 })
        }


        return NextResponse.json({
            message: 'FCM token saved successfully',
            success: true,
        }, { status: 200 })


    } catch (error) {

        console.log("Error in save-token route: ", error.message);
        
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }
}
