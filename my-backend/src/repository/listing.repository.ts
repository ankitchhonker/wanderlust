import Listing, { IListing } from "../models/Listings";


export async function createListingRepo(data:IListing){
    const res = await Listing.create(data);
    return res;
}