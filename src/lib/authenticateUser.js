import User from "@/models/User.models";
import jwt from 'jsonwebtoken';

export async function AuthenticateUser(request) {

    const token = request?.cookies?.get("access-token")?.value || request.headers.get("authorization");
    
    if (!token) return null;


    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const decodedUser = await User.findById(decodedToken._id);
        
        return decodedUser;

    } catch (err) {
        console.log(err)
        return null;
    }


}