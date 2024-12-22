import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {

    const reqBody = await request.json();
    const { pinCode } = reqBody;

    if(!pinCode){
        return NextResponse.json({
            message: "PinCode not found",
            success: false
        }, { status: 400 })
    }
    
    try {

        const response = await axios.get(
            `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pinCode}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${process.env.DEHLIVERY_TOKEN}`,
              },
            }
          );

          return NextResponse.json({
            message: "Fetched Successfully...",
            success: true,
            result: response.data
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500 })
    }

}