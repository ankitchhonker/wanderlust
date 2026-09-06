import { IUser, User } from "../models/User";
import AppError from "../utils/AppError";

export const signUpRepo = async(data:IUser)=>{
    const {username,email,password} = {...data};
    const existing = await User.findOne({email});
    if(existing) throw new AppError(402,"User Already Exist");

    const res = await User.create({username,email,password});
    return res;
}