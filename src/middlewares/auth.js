import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken // || req.header("Authorization")?.replace("Bearer ","")  // ?. --> optional chaining operator it ensure that code doesn't throw error if something is undefined or null.
    
        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  // basically return payload that we mentioned while creating token.
        const user = await User.findById(decodedToken?._id).select("-password -refereshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        // console.log(user);
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})