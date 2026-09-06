import {Request,Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { userSchema } from "../validations/auth.validation";
import AppError from "../utils/AppError";
import { signUpService } from "../services/auth.listing";
import bcrypt from "bcryptjs";
 
export default catchAsync(async function signUpController(req:Request,res:Response,next:NextFunction){
    const data = req.body;
    //validation of data..
    const {error} = userSchema.validate(data);
    if(error)return new AppError(400,"Bad Request");
    //call service
    const result = await signUpService(data);
    return res.status(201).json({message:"Registration Successfull",data:result});
})