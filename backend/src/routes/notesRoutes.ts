import express from 'express'
import * as notesControllers from "../controllers/notesControllers";

const router = express.Router();

router.get('/', notesControllers.getNotes);
router.get('/:noteId', notesControllers.getSingleNote);
router.post('/', notesControllers.createNote);
router.patch('/:noteId', notesControllers.updateNote)
router.delete('/:noteId', notesControllers.deleteNote)

export default router; 