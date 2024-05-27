import app from "./app";
import env from "./util/validateEnv"
import mongoose from "mongoose";

mongoose.connect(env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log("Connected to MongoDB!");
        app.listen(env.PORT, () => {
            console.log(`Server Connected at ${env.PORT}!`);
        })
    })
    .catch(console.error)

