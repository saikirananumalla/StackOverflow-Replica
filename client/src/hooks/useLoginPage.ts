import { BooleanFunctionType } from "../types/functionTypes";
import { useState } from "react";
import { login } from "../services/userService";

/**
 * Custom hook for handling login form logic.
 * Manages input states, error messaging, and calls the backend login API.
 *
 * @param {BooleanFunctionType} onLogin - Callback to be triggered after successful login. Receives a boolean indicating if the user is a moderator.
 * @param {string} csrfToken - CSRF token used for secure login requests.
 *
 * @returns {{
 *   username: string,
 *   setUsername: (val: string) => void,
 *   password: string,
 *   setPassword: (val: string) => void,
 *   handleLogin: () => Promise<void>,
 *   errorMessage: string,
 *   dismissErrorMessage: () => void
 * }} - Login form state and handler functions.
 */
export const useLoginPage = (onLogin: BooleanFunctionType, csrfToken: string) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Attempts to log in with the current username and password.
     * Calls the `onLogin` callback with the user's role upon success.
     */
    const handleLogin = async () => {
        try {
            const response = await login(username, password, csrfToken);

            let isMod = false;
            if (response.role && response.role === 'mod') {
                isMod = true;
            }

            onLogin(isMod);
        } catch (error) {
            setErrorMessage("Invalid username or password, please retry");
            console.error('Error during login', error);
        }
    };

    /**
     * Dismisses any error messages from failed login attempts.
     */
    const dismissErrorMessage = () => {
        setErrorMessage('');
    };

    return {
        username,
        setUsername,
        handleLogin,
        password,
        setPassword,
        errorMessage,
        dismissErrorMessage
    };
};
