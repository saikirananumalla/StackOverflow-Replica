import { useEffect, useState } from "react";
import { getUser } from "../services/userService";

/**
 * Custom hook to fetch and manage the currently logged-in user's profile data.
 * Retrieves user details such as name, email, and role using a CSRF-secured request.
 *
 * @param {string} csrfToken - CSRF token for secure API communication.
 *
 * @returns {{
 *   user: {
 *     name: string,
 *     email: string,
 *     password: string,
 *     role: string
 *   }
 * }} - An object containing the current user's profile information.
 */
export const useUserProfile = (csrfToken: string) => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    /**
     * Fetches user information on component mount or when CSRF token changes.
     */
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUser(csrfToken);
            setUser(res || {});
        };

        fetchUser().catch(e => console.error(e.message));
    }, [csrfToken]);

    return { user };
};
