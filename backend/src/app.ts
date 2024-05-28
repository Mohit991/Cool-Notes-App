import "dotenv/config"
import morgan from 'morgan'
import express, { NextFunction, Request, Response } from 'express';
import notesRoutes from './routes/notesRoutes';
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"))
app.use(express.json())

app.use("/api/notes", notesRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found!"))
}) 

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "Unknown Error Occurred!"
    let statusCode = 500
    if(isHttpError(error)){
        statusCode = error.status
        errorMessage = error.message
    }
    res.status(statusCode).json({error: errorMessage})
})

export default app