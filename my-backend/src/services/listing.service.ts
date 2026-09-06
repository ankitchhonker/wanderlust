import { IListing } from "../models/Listings";
import { createListingRepo } from "../repository/listing.repository";

export default async function createListingService(data:IListing) {
    console.log("Creating the Listing");
    const res = await  createListingRepo(data);
    return res;
}

