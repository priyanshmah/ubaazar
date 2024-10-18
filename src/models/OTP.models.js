import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true
    },
    verificationCode: {
        type: Number,
        required: true
    },
    expiresIn: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }
    }
}, { timestamps: true})

export default mongoose.models.otp || mongoose.model("otp", otpSchema)