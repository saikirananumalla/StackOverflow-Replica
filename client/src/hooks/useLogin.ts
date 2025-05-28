import { useEffect, useState } from "react";
import { getCsrfToken, logout } from "../services/userService";

/**
 * Custom hook that manages user login state, CSRF token retrieval, and logout logic.
 *
 * @returns {{
 *   isLoggedIn: boolean,
 *   csrfToken: string,
 *   mod: string,
 *   handleLogin: (isMod: boolean) => void,
 *   handleLogout: () => void
 * }} - User authentication state and control handlers.
 */
export const useLogin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const [mod, setMod] = useState("");

    /**
     * On mount, retrieves CSRF token and checks local storage to determine login state.
     */
    useEffect(() => {
        const storedLogin = localStorage.getItem('isLoggedIn');
        getCsrfToken().then(csrf => setCsrfToken(csrf.data.csrfToken));

        if (storedLogin !== null) {
            setIsLoggedIn(true);
        }
    }, []);

    /**
     * Handles login by setting login state and optionally marking the user as a moderator.
     *
     * @param {boolean} isMod - Indicates if the logged-in user is a moderator.
     */
    const handleLogin = (isMod: boolean) => {
        localStorage.setItem('isLoggedIn', "true");
        setIsLoggedIn(true);
        if (isMod) {
            setMod("mod");
        } else {
            setMod("");
        }
    };

    /**
     * Handles logout by calling the backend logout service, clearing local state,
     * and refreshing the page.
     */
    const handleLogout = () => {
        try {
            logout(csrfToken);
            localStorage.removeItem('isLoggedIn');
            setIsLoggedIn(false);
            window.location.reload();
        } catch (e) {
            // TODO: Proper error handling and typing
            console.log(e);
        }
    };

    return { isLoggedIn, csrfToken, mod, handleLogin, handleLogout };
};
