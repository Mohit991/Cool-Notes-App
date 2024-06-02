import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../api/notesAPI";
import * as NotesAPI from "../api/notesAPI";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from '../styles/utils.module.css'
import { useState } from "react";
import { ConflictError } from "../errors/http_errors";

interface SignUpModelProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void
}
const SignUpModel = ({onDismiss, onSignUpSuccessful}: SignUpModelProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<SignUpCredentials>()
    const [errorText, setErrorText] = useState<string | null>(null)

    async function onSubmit(credentials:SignUpCredentials) {
        try {
            const newUser = await NotesAPI.signUp(credentials)
            onSignUpSuccessful(newUser)
        } catch (error) {
            if(error instanceof ConflictError){
                setErrorText(error.message)
            }
            else{
                alert(error)
            }
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
                {
                    errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
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