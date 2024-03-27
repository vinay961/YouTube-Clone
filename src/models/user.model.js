import {mongoose,Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, // cloudinary url comes which is stored by us.
        required: true
    },
    coverImage:{
        type: String,
        required: false
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }   
    ],
    password:{
        type: String,
        required: [true,"Password is required"]
    },
    refreshToken:{
        type: String
    }    
}, {timestamps: true})

userSchema.pre("save",function(next) {

    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return bcrypt.compare(password,this.password)  // it gives result in true/false way
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)