
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";



const connectDB = async() => {
    try{
        const connectingDB = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectingDB.connection.host}`);
    }catch(error){
        console.log("Get Error while connecting to Database:",error);
        process.exit(1)
    }
}

export default connectDB;