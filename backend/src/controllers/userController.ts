import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user'

interface SignUpBody{
    username?: string, 
    email?: string, 
    password?: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const email = req.body.email
    const passwordRaw = req.body.password

    try {
        if(!username || !email || !passwordRaw){
            throw createHttpError(400, "Parameters missing!")
        }

        const existingUser = await UserModel.findOne({username: username}).exec()
        if(existingUser){
            throw createHttpError(409, "Username already taken. Please choose a different username")
        }

        const  existingEmail = await UserModel.findOne({email: email}).exec()
        if(existingEmail){
            throw createHttpError(409, "Email already in use.")
        }

        
    } catch (error) {
        next(error)
    }
}