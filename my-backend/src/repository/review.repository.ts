import Listing from "../models/Listings";
import { Review } from "../models/Review";
import AppError from "../utils/AppError";

export async function createReviewRepo(id:string, data:any){
    const res = await Review.create(data);
    const listing = await Listing.findById(id);
    if(!listing)throw new AppError(400,"Listing Not Found");
    listing.reviews.push(res._id);
    await listing.save();
    return listing;
}