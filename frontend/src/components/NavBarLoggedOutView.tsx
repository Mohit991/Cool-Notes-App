import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps{
    onSignUpClicked: () => void,
    onLogInClicked: () => void
}
const NavBarLoggedOutView = ({onSignUpClicked, onLogInClicked}: NavBarLoggedOutViewProps) => {
    return ( 
        <>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
            <Button onClick={onLogInClicked}>Log In</Button>
        </>
     );
}
 
export default NavBarLoggedOutView;