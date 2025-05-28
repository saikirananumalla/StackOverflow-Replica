import { REACT_APP_API_URL, api } from "./config";

// Base URLs for user and CSRF-related API endpoints
const USER_API_URL = `${REACT_APP_API_URL}/user`;
const CSRF_URL = `${REACT_APP_API_URL}/csrf-token`;

/**
 * Registers a new user by sending their name, email, and password to the backend.
 *
 * @param {string} name - The user's display name.
 * @param {string} mail - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} csrfToken - CSRF token for secure request.
 *
 * @returns {Promise<any>} - Response data from the registration API.
 */
const signUp = async (name: string, mail: string, password: string, csrfToken: string) => {
    const data = { name: name, email: mail, password: password };
    const res = await api.post(`${USER_API_URL}/register`, data, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });

    return res.data;
};

/**
 * Retrieves a CSRF token from the server.
 *
 * @returns {Promise<any>} - Response containing the CSRF token.
 */
const getCsrfToken = async () => {
    return await api.get(CSRF_URL);
};

/**
 * Authenticates a user with their username and password.
 *
 * @param {string} name - The user's username.
 * @param {string} password - The user's password.
 * @param {string} csrfToken - CSRF token for secure request.
 *
 * @returns {Promise<any>} - Response data from the login API.
 */
const login = async (name: string, password: string, csrfToken: string) => {
    const data = { username: name, password: password };
    const res = await api.post(`${USER_API_URL}/login`, data, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });

    return res.data;
};

/**
 * Logs out the currently authenticated user.
 *
 * @param {string} csrfToken - CSRF token for secure request.
 *
 * @returns {Promise<void>}
 */
const logout = async (csrfToken: string) => {
    await api.post(`${USER_API_URL}/logout`, {}, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
};

/**
 * Fetches the current authenticated user's profile data.
 *
 * @param {string} csrfToken - CSRF token for secure request.
 *
 * @returns {Promise<any>} - Response data containing the user profile.
 */
const getUser = async (csrfToken: string) => {
    const res = await api.get(`${USER_API_URL}/getUser`, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });

    return res.data;
};

export { signUp, login, getCsrfToken, getUser, logout };
