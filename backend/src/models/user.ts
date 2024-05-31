import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        select: false //we dont want to fetch username from DB
    },
    password: {
        type: String,
        required: true,
        select: false //we dont want to password username from DB
    },
})

type User = InferSchemaType<typeof userSchema>

export default model<User>("User", userSchema)