 
import mongoose, { Schema } from "mongoose";


export interface IUser extends Document {
    username:string;
    email:string;
    password:string;
    watchlist?:mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    username:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String, required:true},
    watchlist:[{type:Schema.Types.ObjectId, ref:"Listing"}]
})

export const User = mongoose.model<IUser>("User",userSchema);
