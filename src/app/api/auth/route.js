import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Jwt from 'jsonwebtoken'
import User from "@/models/User.models";

export async function GET(request) {

    await dbConnect();
    const token = request?.cookies?.get('token');
    console.log(request.cookies);
    

    try {
        console.log(token);
        

        if (!token) {
            return NextResponse.json({
                success: false
            }, { status: 400 })
        }

        const decodedToken = Jwt.verify(token.value, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);
        if (user) {
            return NextResponse.json({
                success: true 
            }, { status: 200 })
        } else {
            return NextResponse.json({
                success: false
            }, { status: 400 })
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500})
    }       
   
}