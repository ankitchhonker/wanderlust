import Listing, { IListing } from "../models/Listings";
import AppError from "../utils/AppError";


export async function createListingRepo(data:IListing){
    const res = await Listing.create(data);
    return res;
}
export async function getListingRepo(){
    const res = await Listing.find().populate("owner" ,"username email") 
    return res;
}
export async function getListingByIdRepo(id:string){

    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",          
        populate: {
            path: "author",       
            select: "username"     
        }
    })
    .populate("owner");   

    if(!listing)throw new AppError(404,"Listing Not Found")
    return listing;
}