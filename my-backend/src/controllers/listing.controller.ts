
import {Request, Response} from "express";
import createListingService from "../services/listing.service";
import { listingSchema } from "../validations/listing.validation";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export default catchAsync(  async function createListingController(req:Request,res:Response) {
    const data = req.body;
     
        const {error} = listingSchema.validate(data);
        if(error){
            console.log(error);
            throw new AppError(400, error.details[0]!.message);
        }
        const result = await createListingService(data);
        return  res.status(201).json({"message":"Listing Created Successfuly","data":result});
    
})