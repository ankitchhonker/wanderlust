import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { reviewSchema } from "../validations/review.validation";
import AppError from "../utils/AppError";
import { createReviewService } from "../services/review.service";

export const createReviewController = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const data = req.body;
    const {error} = reviewSchema.validate(data);
    if(error){
        throw new AppError(400, error.details[0]!.message);
    }
    const {id}  = req.params;
    data.author = req.user._id;
    const result = await createReviewService(id,data);
    return res.status(201).json({message:"Review Post SuccessFully",data:result});
})