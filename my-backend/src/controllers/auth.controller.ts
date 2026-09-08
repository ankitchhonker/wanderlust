import {Request,Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { userSchema } from "../validations/auth.validation";
import AppError from "../utils/AppError";
import { loginServive, signUpService } from "../services/auth.service";
 
export const signUpController =  catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const data = req.body;
    //validation of data..
    const {error} = userSchema.validate(data);
    if(error) throw new AppError(400,error.details[0]!.message);
    //call service
    const result = await signUpService(data);
    return res.status(201).json({message:"Registration Successfull",data:result});
})

export const loginController = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const data = req.body;
    if(!data.email || !data.password)return new AppError(402,"All fields are required");
    const result = await loginServive(data);
    return res.status(200).json({message:"Login Successfull",data:result});
})