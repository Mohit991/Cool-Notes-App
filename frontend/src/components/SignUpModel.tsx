import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../api/notesAPI";
import * as NotesAPI from "../api/notesAPI";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from '../styles/utils.module.css'

interface SignUpModelProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void
}
const SignUpModel = ({onDismiss, onSignUpSuccessful}: SignUpModelProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<SignUpCredentials>()
    async function onSubmit(credentials:SignUpCredentials) {
        try {
            const newUser = await NotesAPI.signUp(credentials)
        } catch (error) {
            alert(error)
            console.log(error);
            
        }
    }
    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField 
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Enter username"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.username}
                    />

                    <TextInputField 
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.email}
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
                        Sign Up
                    </Button>

                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default SignUpModel;