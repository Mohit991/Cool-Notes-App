import { useEffect, useState } from 'react';
import * as NotesAPI from './api/notesAPI';
import LoginModel from './components/LoginModel';
import NavBar from './components/NavBar';
import SignUpModel from './components/SignUpModel';
import { User } from './models/user';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './components/pages/NotesPage';
import PrivacyPage from './components/pages/PrivacyPage';
import PageNotFound from './components/pages/PageNotFound';
import styles from './styles/App.module.css'

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
		<BrowserRouter>
			<div>
				<NavBar 
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginUpModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className={styles.pageContainer}>
					<Routes>
						<Route 
							path="/"
							element={<NotesPage loggedInUser={loggedInUser} />}
						/>
						<Route 
							path='/privacy'
							element={<PrivacyPage />}
						/>
						<Route 
							path='/*'
							element={<PageNotFound />}
						/>
					</Routes>
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
		</BrowserRouter>
	);
}

export default App;
