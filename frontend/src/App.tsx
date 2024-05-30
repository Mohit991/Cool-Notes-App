import React, { useState, useEffect } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row } from 'react-bootstrap';
import styles from './styles/NotesPage.module.css'
import styleUtils from './styles/utils.module.css'
import * as NotesAPI from './api/notesAPI'
import AddNoteDialog from './components/AddEditNoteDialog';
import {FaPlus} from 'react-icons/fa'
import AddEditNoteDialog from './components/AddEditNoteDialog';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesAPI.fetchNotes()
        setNotes(notes)
      } catch (error) {
        console.log(error);
        alert(error)
      }
    }
    loadNotes()  
  }, [])

  async function deleteNote(note: NoteModel){
    try {
      await NotesAPI.deleteNote(note._id)
      setNotes(notes.filter(existingNotes => existingNotes._id != note._id))
    } catch (error) {
      console.log(error);
      alert(error)
    }
  }
  return (
    <Container>
      <Button 
      className = {`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      onClick={() => {setShowAddNoteDialog(true)}}>
      <FaPlus />
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id}>
            <Note 
              note={note} 
              className={styles.note}
              onNoteClicked={setNoteToEdit}
              onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))}
      </Row>
      {
        showAddNoteDialog && 
        <AddNoteDialog 
          onDismiss={() => {setShowAddNoteDialog(false)}}
          onNoteSave={(newNote) => {
            setNotes([...notes, newNote])
            setShowAddNoteDialog(false)
          }}
        />
      }
      {
        noteToEdit && 
        <AddEditNoteDialog
        noteToEdit={noteToEdit}
        onDismiss={() => setNoteToEdit(null)}
        onNoteSave={(updatedNote) => {
          setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
          setNoteToEdit(null)
        }}
        />
      }
    </Container>
  );
}

export default App;
