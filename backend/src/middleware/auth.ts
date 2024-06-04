import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    console.log("User ID from Cookie: " + req.session.userId)
    if(req.session.userId){
        next()
    }
    else{
        next(createHttpError(401, "User not authenticated!"))
    }
}
