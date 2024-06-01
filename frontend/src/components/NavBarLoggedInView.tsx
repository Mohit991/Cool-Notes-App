import { User } from "../models/user";
import * as NotesAPI from "../api/notesAPI";
import { Button, Navbar } from "react-bootstrap";

interface NavBarLoggedInViewProps {
    user: User,
    onLogOutSuccessful: () => void
}

const NavBarLoggedInView = ({user, onLogOutSuccessful}: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await NotesAPI.logOut()
            onLogOutSuccessful()
        } catch (error) {
            console.log(error);
            alert(error)
        }
    }
    return ( 
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Log out</Button>
        </>
     );
}
 
export default NavBarLoggedInView;