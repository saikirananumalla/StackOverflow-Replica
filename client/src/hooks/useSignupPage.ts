import { useState } from "react";
import { login, signUp } from "../services/userService";
import { BooleanFunctionType } from "../types/functionTypes";

/**
 * Custom hook for managing user registration (signup) logic.
 * Handles input state for username, email, and password, and attempts to register the user.
 * If successful, automatically logs the user in and calls `onLogin` with moderator status.
 *
 * @param {BooleanFunctionType} onLogin - Callback function to update login state after successful signup.
 * @param {string} csrfToken - CSRF token for secure API requests.
 *
 * @returns {{
 *   username: string,
 *   setUsername: (val: string) => void,
 *   password: string,
 *   setPassword: (val: string) => void,
 *   mail: string,
 *   setMail: (val: string) => void,
 *   errorMessage: string,
 *   dismissErrorMessage: () => void,
 *   handleSubmit: () => Promise<void>
 * }} - Signup form state and handler functions.
 */
export const useSignupPage = (onLogin: BooleanFunctionType, csrfToken: string) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handles form submission for signing up a new user.
     * On successful signup, automatically logs the user in.
     * Displays an error message if signup fails.
     */
    const handleSubmit = async () => {
        const errMsg = "Please ensure your password is more than 6 characters, and email address is valid." +
            " If both the above are true, try with a different username";

        signUp(username, mail, password, csrfToken).then((resp) => {
            if (resp && !resp.error) {
                login(username, password, csrfToken).then(() => onLogin(resp.role === 'mod'));
            } else {
                setErrorMessage(errMsg);
            }
        }).catch(() => {
            setErrorMessage(errMsg);
        });
    };

    /**
     * Clears any displayed error message.
     */
    const dismissErrorMessage = () => {
        setErrorMessage('');
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        errorMessage,
        dismissErrorMessage,
        handleSubmit,
        mail,
        setMail
    };
};
