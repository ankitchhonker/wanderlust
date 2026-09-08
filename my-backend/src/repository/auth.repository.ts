import { IUser, User } from "../models/User";
import AppError from "../utils/AppError";

export const signUpRepo = async(data:IUser)=>{
    const {username,email,password} = {...data};
    const existing = await User.findOne({email});
    console.log(existing);
    if(existing) throw new AppError(409,"User Already Exist");

    const res = await User.create({username,email,password});
    return res;
}

export const loginRepo = async (data : any)=>{
    const {email,password} =  {...data};
    const exist = await User.findOne({email});
    if(!exist)throw new AppError(401,"User doesn't exist with this email please registred yourself");
    return exist; 
}

 