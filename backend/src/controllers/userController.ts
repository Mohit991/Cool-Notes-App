import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user'
import bcrypt from 'bcrypt'

interface SignUpBody{
    username?: string, 
    email?: string, 
    password?: string
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId
    try {
        if(!authenticatedUserId){
            throw createHttpError(401, "User not authenticated!")
        }
        const user = await UserModel.findById(authenticatedUserId).select("+email").exec()
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
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
        
        const passwordHash = await bcrypt.hash(passwordRaw, 10)

        const newUser = await UserModel.create({
            username: username, 
            email: email,
            password: passwordHash
        })

        req.session.userId = newUser._id

        res.status(201).json(newUser)
        
    } catch (error) {
        next(error)
    }
}

interface LoginBody {
    username?: string,
    password?: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if(!username || !password){
            throw createHttpError(400, "Perameters missing!")
        }

        const user = await UserModel.findOne({username: username}).select("+password +email").exec()

        if(!user){
            throw createHttpError(401, "Invalid credentials!")
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            throw createHttpError(401, "Invalid credentials!")
        }

        req.session.userId = user._id
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}


export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if(error){
            next(error)
        }
        else{
            res.sendStatus(200)
        }
    })
}