import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * Entry point for the React application.
 * Mounts the root App component to the DOM element with id "root".
 */
const container = document.getElementById("root");

if (container) {
    const root = createRoot(container);
    root.render(
        <>
            <App />
        </>
    );
}
