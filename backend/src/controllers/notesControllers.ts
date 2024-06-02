import { RequestHandler } from "express";
import NoteModel from '../models/note'
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId
    try{
        assertIsDefined(authenticatedUserId)
        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes)
    }
    catch(error){
        next(error)
    }
}

export const getSingleNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId
    const authenticatedUserId = req.session.userId
    try {
        assertIsDefined(authenticatedUserId)
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid NoteId")
        }
        const note = await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404, "Note not found")
        }
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You can not access this note.")
        }
        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

interface CreateNoteBody{
    title?: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title
    const text = req.body.text
    const authenticatedUserId = req.session.userId
    try{
        assertIsDefined(authenticatedUserId)
        if(!title){
            throw createHttpError(400, "Note must have a title")
        }
        const newNote =  await NoteModel.create({
            userId: authenticatedUserId,
            title: title, 
            text: text
        })
        res.status(201).json(newNote)
    }
    catch(error){
        next(error)
    }
}


interface UpdateNoteParam{
    noteId: string
}
interface UpdateNoteBody{
    title?: string, 
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParam, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId
    const newTitle = req.body.title
    const newText = req.body.text
    const authenticatedUserId = req.session.userId


    try {
        assertIsDefined(authenticatedUserId)

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid NoteId")
        }
        if(!newTitle){
            throw createHttpError(400, "Note must have a title")
        }

        const note = await NoteModel.findById(noteId).exec()
        
        if(!note){
            throw createHttpError(404, "Note not found")
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You can not access this note.")
        }

        note.title = newTitle
        note.text = newText
        const updatedNote = await note.save()
        res.status(200).json(updatedNote)

    } catch (error) {
        next(error)
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId
    const authenticatedUserId = req.session.userId

    try {
        assertIsDefined(authenticatedUserId)

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid NoteId")
        }
        const note = await NoteModel.findById(noteId).exec()
        if(!note){
            throw createHttpError(404, "Note not found")
        }
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You can not access this note.")
        }
        await NoteModel.findByIdAndDelete(noteId)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}