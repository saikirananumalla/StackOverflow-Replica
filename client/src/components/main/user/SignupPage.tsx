import React from 'react';
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Alert, TextField } from "@mui/material";
import Input from "../baseComponents/input/inputView";
import { LoginButton } from "./userStyle";
import { BooleanFunctionType } from "../../../types/functionTypes";
import { useSignupPage } from "../../../hooks/useSignupPage";

/**
 * Props for the SignUpPage component.
 */
interface SignUpPageProps {
    csrfToken: string;
    onLogin: BooleanFunctionType;
}

/**
 * `SignUpPage` component renders a user registration form.
 * It handles input for username, password, and email, and validates before calling the registration API.
 * Upon success, it triggers the `onLogin` function to log the user in.
 *
 * @param {SignUpPageProps} props - Contains CSRF token and login callback after signup.
 * @returns {JSX.Element} The rendered registration form with error handling and link to login.
 */
const SignUpPage = ({ onLogin, csrfToken }: SignUpPageProps): JSX.Element => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        errorMessage,
        dismissErrorMessage,
        handleSubmit,
        mail,
        setMail
    } = useSignupPage(onLogin, csrfToken);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <div style={{ textAlign: 'left', width: '300px', marginBottom: '20px' }}>
                <h2>Fake StackOverflow</h2>
                <h3>Sign Up</h3>
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Input
                        title="Username"
                        id="formUsername"
                        hint="Enter your username"
                        val={username}
                        mandatory={true}
                        setState={setUsername}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        placeholder="Enter minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="formPassword"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <Input
                        title="Email Address"
                        id="formEmail"
                        hint="Enter your mail id"
                        val={mail}
                        mandatory={true}
                        setState={setMail}
                    />

                    <LoginButton
                        variant="contained"
                        type="submit"
                        id="RegisterButton"
                        style={{ marginRight: "10px", background: "black" }}
                    >
                        Register
                    </LoginButton>

                    {errorMessage && (
                        <Alert onClose={dismissErrorMessage} id="ErrorBar">
                            {errorMessage}
                        </Alert>
                    )}
                </Form>
            </div>
            <p>
                Registered user? <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default SignUpPage;
