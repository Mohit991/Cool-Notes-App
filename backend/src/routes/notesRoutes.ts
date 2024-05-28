import express from 'express'
import * as notesControllers from "../controllers/notesControllers";

const router = express.Router();

router.get('/', notesControllers.getNotes);
router.get('/:noteId', notesControllers.getSingleNote);
router.post('/', notesControllers.createNote);

export default router; 