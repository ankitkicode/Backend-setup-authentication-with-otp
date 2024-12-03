import mongoose from "mongoose";

const dbConnection = async (uri) => {
    try {
        await mongoose.connect(uri, );
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default dbConnection;