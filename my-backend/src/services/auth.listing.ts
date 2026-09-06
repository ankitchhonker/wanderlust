import { IUser } from "../models/User";
import { signUpRepo } from "../repository/auth.repositor";
import bcrypt from "bcryptjs";
export async function signUpService(data:IUser){
    const {username,email,password} = {...data};
    const hashpassword = await bcrypt.hash(password,12);
    const res = await signUpRepo({username,email,password:hashpassword});
    return res;
}