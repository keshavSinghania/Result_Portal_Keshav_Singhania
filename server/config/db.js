import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error("MongoDB connection failed", error.message || error);
        process.exit(1);
    }
}
export default connectDB;