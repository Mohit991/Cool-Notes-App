import { User } from "../models/user";
import { LoginInCredentials } from "../api/notesAPI";
import * as NotesAPI from "../api/notesAPI";
import TextInputField from "./form/TextInputField";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import stylesUtils from '../styles/utils.module.css'

interface LoginModelProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void
}
const LoginModel = ({onDismiss, onLoginSuccessful}: LoginModelProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<LoginInCredentials>()
    async function onSubmit(credentials: LoginInCredentials){
        try {
            const user = await NotesAPI.logIn(credentials)
            onLoginSuccessful(user)
        } catch (error) {
            alert(error)
            console.log(error);
        }
    }
    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Log In
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField 
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.username}
                    />
                    <TextInputField 
                        name="password"
                        label="Password"
                        type="password"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={stylesUtils.width100}
                    >
                        Log In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default LoginModel;