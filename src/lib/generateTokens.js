import User from "@/models/User.models";
import jwt from 'jsonwebtoken';
import dbConnect from "./dbConnect";

export default async function generateAccessAndRefreshTokens (userId){
    try {
        await dbConnect();

        const user = await User.findById(userId);       
        const accessToken = jwt.sign(
            { _id: user._id, isSeller: user.isSeller },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )        
        const refreshToken = jwt.sign({
                _id: user._id,
                username: user.username,
                mobileNumber: user.mobileNumber
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        )
        
        await User.findByIdAndUpdate(
            user._id,
            { refreshToken }
        )
        return { accessToken, refreshToken }

    } catch (error) {
        console.log("Error occured while generating tokens: ", error);
        return { accessToken: null, refreshToken: null }
    }
}