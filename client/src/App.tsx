import React from "react";
import FakeStackOverflow from "./components/fakestackoverflow";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupPage from "./components/main/user/SignupPage";
import LoginPage from "./components/main/user/LoginPage";
import { useLogin } from "./hooks/useLogin";

/**
 * The root component of the application.
 *
 * - If the user is logged in, renders the main `FakeStackOverflow` component.
 * - If the user is not logged in, displays routes for login and signup pages.
 *
 * Uses a custom `useLogin` hook to manage login state, mod status, CSRF token, and logout functionality.
 *
 * @returns {JSX.Element} The main application component.
 */
function App(): JSX.Element {
    // Custom login hook for auth state and CSRF handling
    const { isLoggedIn, csrfToken, mod, handleLogin, handleLogout } = useLogin();

    return (
        <Router>
            <div className="App">
                {isLoggedIn ? (
                    <div>
                        <FakeStackOverflow
                            csrfToken={csrfToken}
                            mod={mod}
                            handleLogout={handleLogout}
                        />
                    </div>
                ) : (
                    <Routes>
                        <Route
                            path="/signup"
                            element={<SignupPage onLogin={handleLogin} csrfToken={csrfToken} />}
                        />
                        <Route
                            path="/"
                            element={<LoginPage onLogin={handleLogin} csrfToken={csrfToken} />}
                        />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;
