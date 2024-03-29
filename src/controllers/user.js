import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'


const generateAccessAndGenerateToken = async(userId) => {
    try{
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refereshToken = user.generateRefreshToken()

        user.refereshToken = refereshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refereshToken}

    }catch(err){
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async(req,res) => {
    // get user details from backend
    // validation
    // check if user already exist
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullname,email,username,password} = req.body;

    if (
        [fullname,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    
    if(existedUser) {
        throw new ApiError(400 , "User with email or username already exists.")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.CoverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(500, "Something went wrong while registring the user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser , "User registered Successfully.")
    )

} )

const loginUser = asyncHandler(async (req,res) => {
    // req body --> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {email,username,password} = req.body

    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = User.findOne({
        $or : [{username},{email}]  // it find user on basis of username or email.
    })

    if(!user){
        throw new ApiError(404, "User Not found!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Password is not correct.")
    }

    const {accessToken,refereshToken} = await generateAccessAndGenerateToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refereshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refereshToken",refereshToken,options)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refereshToken},"User logged In successfully"))

})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(req.user._id,{
        $set: {refereshToken}
    })
},{new:true})

const options = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refereshToken",options)
.json(new ApiResponse(200, {}, "User logged Out"))


export {registerUser,loginUser,logoutUser}