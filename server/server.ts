import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";
import dotenv from "dotenv";
import {MONGO_URL, port} from "./config";

dotenv.config();
mongoose.connect(MONGO_URL);

// --- Server startup ---

const server: Server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed.");
    });

    mongoose.disconnect()
        .then(() => {
            console.log("Database instance disconnected.");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Error during disconnection:", err);
            process.exit(1);
        });
});

export default server;
