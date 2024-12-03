import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import validUser from "../middlewares/isValidUser.js";
import crypto from "crypto";


const router = express.Router();

const generateOtp =  ()=>{
   const otp = Math.floor(100000 + Math.random() * 900000);
   return otp;
}
const sendOtp = async  (email,otp)=>{
   const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD
      }
   });
   const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for password reset",
      text: `Your OTP is ${otp}`
   };
   await transporter.sendMail(mailOptions);
   return true;
}

router.post("/register-user",async (req,res)=>{
   const {name,email,password} = req.body;

   if (!name || !email || !password) {
      return res.status(400).json({
         success:false,
         message:"Please enter all fields.."
      });

   try {
      const userExists = await User.findOne({email:email});

      if (userExists) {
         return res.status(400).json({
            success:false,
            message:"User already exists.."
         });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const OTP = generateOtp();
      console.log(OTP);
      const user = new User({
         name,
         email,
         password:hashedPassword,
         otp:OTP
      });
     await user.save();
     const sendMail = await sendOtp(email,OTP);
     console.log(sendMail);

       res.json({
         success:true,
         message:"User registered successfully..",
         user
      });
      
   } catch (error) {
      return res.json({
         success:false,
         message:error.message
      });
   }
}});

router.post("/verify-user",async (req,res)=>{
   const {email,otp} = req.body;

   try {
      const user = await User.findOne({   
         email:email,
      });
      if (!user) {
         return res.json({
            success:false,
            message:"User not found.."
         });
      }
      if (user.otp !== otp) {
         return res.json({
            success:false,
            message:"Invalid OTP.."
         });
      }
      user.isVerifiyed = true;
      user.otp = null;
      await user.save();
      res.json({
         success:true,
         message:"User verified successfully.."
      });

   } catch(error){
      return res.json({
         success:false,
         message:error.message
      });
   }
});

router.post("/login-user",async (req,res)=>{
   const {email,password} = req.body;
   try {
      const userExists = await User.findOne({email:email});
      if (!userExists) {
         return res.json({
            success:false,
            message:"User not found.."
         });
      }
      if (!userExists.isVerifiyed) {
         return res.json({
            success:false,
            message:"User not verified.."
         });
      } 
      const isValidPassword = await bcrypt.compare(password,userExists.password);
      if (!isValidPassword) {
         return res.json({
            success:false,
            message:"Invalid password.."
         });
      }
      const token = jwt.sign({id:userExists._id},process.env.JWT_SECRET,{expiresIn:"1h"});
      res.json({
         success:true,
         token:token,
         message:"User logged in successfully"
      });
   } catch (error) {
      return res.json({
         success:false,
         message:error.message
      });
   }
});
router.get("/user-details", validUser, async (req,res)=>{
   try {
      const user = await User.findById(req.user.id).select("-password");
  if(!user){
      return res.json({
         success:false,
         message:"User not found.."
      });
  }

      res.json({
         success:true,
         user:user
      });
   } catch (error) {
      return res.json({
         success:false,
         message:error.message
      });
   }
  
})




export default router;
