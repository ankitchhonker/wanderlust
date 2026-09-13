import { createReviewRepo } from "../repository/review.repository";

export async function createReviewService(id:string ,data:any){
    const res = await createReviewRepo(id,data);
    return res;
}