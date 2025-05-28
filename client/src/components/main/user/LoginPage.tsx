import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, TextField } from "@mui/material";
import { Form } from "react-bootstrap";
import Input from "../baseComponents/input/inputView";
import { LoginButton } from "./userStyle";
import { BooleanFunctionType } from "../../../types/functionTypes";
import { useLoginPage } from "../../../hooks/useLoginPage";

/**
 * Props for the LoginPage component.
 */
interface LoginPageProps {
    csrfToken: string;
    onLogin: BooleanFunctionType;
}

/**
 * `LoginPage` is a user authentication component that renders the login form.
 * It captures username and password input, validates the data,
 * and calls the login handler via a custom hook.
 *
 * @param {LoginPageProps} props - Contains the CSRF token and login callback function.
 * @returns {JSX.Element} The rendered login form with input fields and error handling.
 */
const LoginPage = ({ onLogin, csrfToken }: LoginPageProps): JSX.Element => {
    const {
        username,
        setUsername,
        handleLogin,
        password,
        setPassword,
        errorMessage,
        dismissErrorMessage
    } = useLoginPage(onLogin, csrfToken);

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
                <h3>Login</h3>
                <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="formPassword"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <LoginButton
                        variant="contained"
                        type="submit"
                        id="LoginButton"
                        style={{ marginRight: "10px", background: "black" }}
                    >
                        Login
                    </LoginButton>
                    {errorMessage && (
                        <Alert onClose={dismissErrorMessage} id="ErrorBar">
                            {errorMessage}
                        </Alert>
                    )}
                </Form>
            </div>
            <p>
                New user? <Link to="/signup" id="RegisterLink">Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;
