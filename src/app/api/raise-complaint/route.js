import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaints.models";
import { NextResponse } from "next/server";

export async function POST(request) {

    await dbConnect();
    try {

        const reqBody = await request.json();
        const { complaint, contactInfo, name } = reqBody;

        if (!complaint || !contactInfo || !name) {
            return NextResponse.json({
                message: "Missing data to raise complaint",
                success: false
            }, { status: 404 })
        }

        const newComplaint = await Complaint.create({
            complaint,
            contactInfo,
            name,
            complaintNumber: generateComplaintNumber()
        });

        if (!newComplaint) {
            return NextResponse.json({ message: "Something went wrong while registering complaint", success: false }, { status: 500 })
        }

        return NextResponse.json({
            message: "Complaint registered successfully",
            complaintNumber: newComplaint.complaintNumber,
            success: true
        }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message, success: false }, { status: 500 })
    }
}

function generateComplaintNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}