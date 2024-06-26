import "dotenv/config";
import morgan from 'morgan';
import express, { NextFunction, Request, Response } from 'express';
import notesRoutes from './routes/notesRoutes';
import userRoutes from './routes/userRoutes';
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from './util/validateEnv';
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'https://cool-notes-app-sigma.vercel.app',
    credentials: true,
}));


app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true, // Ensure secure is set to true for HTTPS
        sameSite: 'none', // Required for cross-origin cookies
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1 hour         
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGODB_CONNECTION_STRING
    })
}));

app.use(morgan("dev"));
app.use(express.json());



app.use("/api/user", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found!"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "Unknown Error Occurred!";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
