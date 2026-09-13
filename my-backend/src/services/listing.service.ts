import { IListing } from "../models/Listings";
import { createListingRepo, getListingByIdRepo, getListingRepo } from "../repository/listing.repository";

export  async function createListingService(data:IListing) {
    const res = await  createListingRepo(data);
    return res;
}

export async function getListingService(){
    const res = await getListingRepo();
    return res;
}

export async function getListingByIdService(id:string){
    const res = await getListingByIdRepo(id);
    return res;
}