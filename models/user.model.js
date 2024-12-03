import mongoose from "mongoose";

// Define the schema

const userSchema = new mongoose.Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerifiyed: { type: Boolean, default: false },
    otp: { type: String, },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); 

const User = mongoose.model("User",userSchema);

export default User;

