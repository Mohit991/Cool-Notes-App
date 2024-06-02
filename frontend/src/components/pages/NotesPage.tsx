import { Container } from "react-bootstrap";
import NotesPageLoggedOutView from "../NotesPageLoggedOutView";
import NotesPageLoggedInView from "../NotesPageLoggedInView";
import styles from '../../styles/NotesPage.module.css'
import { User } from "../../models/user";

interface NotesPageProps {
    loggedInUser: User | null
}
const NotesPage = ({loggedInUser}: NotesPageProps) => {
    return ( 
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
     );
}
 
export default NotesPage;