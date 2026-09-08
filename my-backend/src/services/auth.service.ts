 
import { IUser } from "../models/User";
import { loginRepo, signUpRepo } from "../repository/auth.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export async function signUpService(data:IUser){
    const {username,email,password} = {...data};
    const hashpassword = await bcrypt.hash(password,12);
    data.password = hashpassword;
    const res = await signUpRepo(data);
    
    const token = jwt.sign(
    { userId: res._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
return { token };
     
}

export async function loginServive(data:any){
    const {email,password} = {...data};
    const user = await loginRepo({email,password});

    if(!(await bcrypt.compare(password,user.password)))throw new AppError(401, "Invalid email or password");
     const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
    return {token};
}
