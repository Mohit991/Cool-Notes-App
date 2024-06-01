import React, { useState, useEffect } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import styles from './styles/NotesPage.module.css'
import styleUtils from './styles/utils.module.css'
import * as NotesAPI from './api/notesAPI'
import AddNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from 'react-icons/fa'
import AddEditNoteDialog from './components/AddEditNoteDialog';
import SignUpModel from './components/SignUpModel';
import LoginModel from './components/LoginModel';
import NavBar from './components/NavBar';

function App() {
	const [notes, setNotes] = useState<NoteModel[]>([])
	const [notesLoading, setNotesLoading] = useState(true)
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

	const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
	const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
	useEffect(() => {
		async function loadNotes() {
			try {
				setShowNotesLoadingError(false)
				setNotesLoading(true)
				const notes = await NotesAPI.fetchNotes()
				setNotes(notes)
			} catch (error) {
				console.log(error);
				setShowNotesLoadingError(true)
			}
			finally {
				setNotesLoading(false)
			}
		}
		loadNotes()
	}, [])

	async function deleteNote(note: NoteModel) {
		try {
			await NotesAPI.deleteNote(note._id)
			setNotes(notes.filter(existingNotes => existingNotes._id != note._id))
		} catch (error) {
			console.log(error);
			alert(error)
		}
	}

	const notesGrid =
		<Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
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

	return (
		<div>
			<NavBar 
				loggedInUser={null}
				onLoginClicked={() => {}}
				onSignUpClicked={() => {}}
				onLogoutSuccessful={() => {}}
			/>
			<Container className={styles.notesPage}>
				<Button
					className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
					onClick={() => { setShowAddNoteDialog(true) }}>
					<FaPlus />
					Add new note
				</Button>
				{
					notesLoading && <Spinner animation='border' variant='primary' />
				}
				{
					!notesLoading && !showNotesLoadingError && 
					<>
						{
							notes.length > 0 ?
							notesGrid : <p>You don't have any notes yet.</p>
						}
					</>
				}
				{
					showNotesLoadingError && <p> Something went wrong. Please refresh the page to reload.</p>
				}
				{
					showAddNoteDialog &&
					<AddNoteDialog
						onDismiss={() => { setShowAddNoteDialog(false) }}
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
				{
					false && 
					<SignUpModel 
						onDismiss={() => {}}
						onSignUpSuccessful={() => {}}
					/>
				}
				{
					false && 
					<LoginModel 
						onDismiss={() => {}}
						onLoginSuccessful={() => {}}
					/>
				}
			</Container>
		</div>
	);
}

export default App;
