import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";
import FcmTokenModels from "@/models/FcmToken.models";
export const runtime = 'nodejs'; // 👈 add this at the top of your file


export async function POST(request) {

    const BATCH_SIZE = 500; // Firebase Cloud Messaging limit
    await dbConnect();

    try {
        const reqBody = await request.json();
        const { title, body, imageUrl, data  } = reqBody;

        const allTokens = await FcmTokenModels.find({}, "fcmToken");
        const tokenList = allTokens.map((doc) => doc.fcmToken);

        if (tokenList.length === 0) {
            return NextResponse.json({
                message: "No tokens found",
                success: false,
            }, { status: 200 });
        }

        let successCount = 0;
        let failureCount = 0;
        let invalidTokens = [];

        // Split into batches of 500
        for (let i = 0; i < tokenList.length; i += BATCH_SIZE) {
            const tokenBatch = tokenList.slice(i, i + BATCH_SIZE);
          
            for (const token of tokenBatch) {
              const message = {
                token,
                data: {
                  title: title || "Notification Title",
                  body: body || "Notification Body",
                  ...data,
                },
              };
          
              try {
                await admin.messaging().send(message);
                successCount++;
              } catch (err) {
                failureCount++;
          
                const errCode = err.code;
                if (
                  errCode === "messaging/invalid-argument" ||
                  errCode === "messaging/registration-token-not-registered"
                ) {
                  invalidTokens.push(token);
                }
              }
            }
          }

        // Remove invalid tokens from DB
        if (invalidTokens.length > 0) {
            await FcmTokenModels.deleteMany({ fcmToken: { $in: invalidTokens } });
        }

        return NextResponse.json({
            message: "Notifications sent",
            totalTokens: tokenList.length,
            successCount,
            failureCount,
            cleanedInvalidTokens: invalidTokens.length,
        }, { status: 200 });



    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 200 })
    }
}
