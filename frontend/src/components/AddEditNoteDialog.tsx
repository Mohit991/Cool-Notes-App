import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../api/notesAPI";
import * as NotesAPI from "../api/notesAPI"
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps{
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSave: (note: Note) => void
}
const AddEditNoteDialog = ({noteToEdit, onDismiss, onNoteSave}: AddEditNoteDialogProps) => {
    
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<NoteInput>({
        defaultValues:{
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    });

    async function onSubmit(input: NoteInput){
        try {
            let noteResponse: Note
            if(noteToEdit){
                noteResponse = await NotesAPI.updateNote(noteToEdit._id, input)
            }
            else{
                noteResponse = await NotesAPI.createNote(input)
            }
            onNoteSave(noteResponse)
        } catch (error) {
            console.log(error);
            alert(error)
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Note
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label={noteToEdit ? "Edit Note": "Add Note"}
                        type="text"
                        placeholder="Title"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                    />

                    <TextInputField 
                    name="text"
                    label="Text"
                    as="textarea"
                    row={5}
                    placeholder="text"
                    register={register}
                    />
                    
                    {/* <Form.Group className="mb-3">
                        <Form.Label>
                            {noteToEdit ? "Edit Note": "Add Note"}
                        </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Title"
                        isInvalid={!!errors.title}
                        {...register("title", {required: "Required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Text
                        </Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Text"
                        {...register("text")}
                        />
                    </Form.Group> */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                type="submit"
                form="addEditNoteForm"
                disabled={isSubmitting}
                >
                    Save 
                </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditNoteDialog;