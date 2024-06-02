import { Container } from 'react-bootstrap';
import LoginModel from './components/LoginModel';
import NavBar from './components/NavBar';
import SignUpModel from './components/SignUpModel';
import styles from './styles/NotesPage.module.css';
import { useEffect, useState } from 'react';
import { User } from './models/user';
import * as NotesAPI from './api/notesAPI'
import NotesPageLoggedInView from './components/NotesPageLoggedInView';
import NotesPageLoggedOutView from './components/NotesPageLoggedOutView';

function App() {

	const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
	const [showSignUpModal, setShowSignUpModal] = useState(false)
	const [showLoginUpModal, setShowLoginUpModal] = useState(false)

	useEffect(() => {
		async function fetchLogginInUser(){
			try {
				const user = await NotesAPI.getLoggedInUser()
				setLoggedInUser(user)
			} catch (error) {
				console.log(error);
			}
		}
		fetchLogginInUser()
	}, [])
	return (
		<div>
			<NavBar 
				loggedInUser={loggedInUser}
				onLoginClicked={() => setShowLoginUpModal(true)}
				onSignUpClicked={() => setShowSignUpModal(true)}
				onLogoutSuccessful={() => setLoggedInUser(null)}
			/>
			<Container className={styles.notesPage}>
				<>
					{
						loggedInUser ? 
						<NotesPageLoggedInView />
						:
						<NotesPageLoggedOutView />
					}
				</>
			</Container>
			{
				showSignUpModal && 
				<SignUpModel 
					onDismiss={() => {setShowSignUpModal(false)}}
					onSignUpSuccessful={(user) => {
						setLoggedInUser(user)
						setShowSignUpModal(false)
					}}
				/>
			}
			{
				showLoginUpModal && 
				<LoginModel 
					onDismiss={() => {setShowLoginUpModal(false)}}
					onLoginSuccessful={(user) => {
						setLoggedInUser(user)
						setShowLoginUpModal(false)
					}}
				/>
			}
		</div>
	);
}

export default App;
