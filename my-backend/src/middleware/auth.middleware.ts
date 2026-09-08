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

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 2. Get the token from the headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // "Bearer eyJhbG..." -> split by space and take the 2nd part
        token = req.headers.authorization.split(" ")[1];
    }

    // 3. If no token, throw a 401 AppError: "You are not logged in! Please log in to get access."
    // YOUR CODE HERE
    if(!token) throw new AppError(401,"You are not logged in! Please log in to get access.")

    // 4. Verify the token using jwt.verify()
  
    // It returns the decoded payload (e.g. { userId: "..." })
    // Use type assertion: as { userId: string }
    // YOUR CODE HERE
    const payload = jwt.verify(token,process.env.JWT_SECRET as string);

    // 5. Find the user in the database using the decoded userId
    // YOUR CODE HERE
    const currentUser = await User.findOne({payload.id});

    // 6. If user doesn't exist anymore, throw a 401 AppError
    // YOUR CODE HERE
    if(!currentUser) throw new AppError(401,"User doesn't exist anymore");

    // 7. Attach the user to the request object!
    req.user = currentUser;

    // 8. Call next() to pass control to the next middleware/controller
    next();
});