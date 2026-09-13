import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { User } from "../models/User";

// 1. Tell TypeScript that Express Request can have a 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    if(!token) throw new AppError(401,"You are not logged in! Please log in to get access.")
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {userId:string};
    const currentUser = await User.findById(payload.userId);
    if(!currentUser)throw new AppError(401,"Invalid User");
    req.user=currentUser;
    next();
})