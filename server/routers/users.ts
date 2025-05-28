import express from "express";
import { sessionAuth } from "../middleware/auth";
import { getUser, logoutUser, userLogin, userSignup } from "../controllers/user";

const userRouter = express.Router();

/**
 * @route POST /user/register
 * @desc Registers a new user
 * @access Public
 */
userRouter.post("/register", userSignup);

/**
 * @route POST /user/login
 * @desc Logs in a user and initializes session
 * @access Public
 */
userRouter.post("/login", userLogin);

/**
 * @route GET /user/getUser
 * @desc Retrieves logged-in user's details
 * @access Private
 */
userRouter.get("/getUser", sessionAuth, getUser);

/**
 * @route POST /user/logout
 * @desc Logs out the current user and destroys session
 * @access Private
 */
userRouter.post("/logout", sessionAuth, logoutUser);

export default userRouter;