import mongoose, { Schema } from "mongoose";

 

export interface IReview extends Document{
    rating:number;
    comment:string;
    author:mongoose.Types.ObjectId;
}

const reviewSchema = new Schema<IReview>({
    rating:{type:Number, required:true},
    comment:{type:String, required:true},
    author:{type:Schema.Types.ObjectId,ref:"User"}
})
 
export const Review = mongoose.model<IReview>("Review",reviewSchema);