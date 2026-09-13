
import {Request, Response} from "express";
import {createListingService,getListingService,getListingByIdService} from "../services/listing.service";
import { listingSchema } from "../validations/listing.validation";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
 
export const createListingController= catchAsync( async  (req:Request,res:Response) => {
    const data = req.body;
    if(req.file){
        data.image={
            url:req.file.path,
            filename:req.file.filename
        }
    }
        const {error} = listingSchema.validate(data);
        if(error){
            throw new AppError(400, error.details[0]!.message);
        }
         data.owner = req.user._id;
        const result = await createListingService(data);
        return  res.status(201).json({"message":"Listing Created Successfuly","data":result});
    
});

export const getListingController = catchAsync(async (req:Request, res:Response)=>{
    const result = await getListingService();
    return res.status(200).json({message:"Listing Fetched Successfully",data:result});
})

export const getListingByIdController = catchAsync(async (req:Request, res:Response)=>{
    const {id} = req.params;
    const result = await getListingByIdService(id);
    return res.status(200).json({message:"Listing Fetched SuccessFully",data:result});
})

 