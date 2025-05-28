import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import User from "../models/users";
import {getLogger} from "log4js";

dotenv.config();
const Logger = getLogger("controllers/user.ts");

/**
 * Validation rules for user login.
 * Ensures username and password are not empty.
 */
const userLoginValidationRules = () => [
    body("username").trim().escape().notEmpty(),
    body("password").trim().notEmpty(),
];

/**
 * Validation rules for user signup.
 * Validates name, email format, and minimum password length.
 */
const userSignupValidationRules = () => [
    body("name").trim().escape().notEmpty(),
    body("email").trim().isEmail(),
    body("password").trim().isLength({ min: 6 }),
];

/**
 * Authenticates user and sets session if credentials are valid.
 *
 * @param req - Express request object with username and password.
 * @param res - Express response object with user session info or error.
 */
export const userLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await Promise.all(userLoginValidationRules().map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: { message: "Invalid username or password" } });
    }

    const sanitizedName = username.trim();
    const user = await User.getUserByName(sanitizedName);

    if (!user) {
        return res.status(404).json({
            error: { message: "User name not found. Invalid login credentials." },
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        const sessionExpiry = "1d";

        const result = {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            expiresIn: sessionExpiry,
        };

        req.session.context = {
            id: user._id,
            name: user.name,
            role: user.role,
        };

        return res.status(200).json({
            ...result,
            message: "You are now logged in.",
        });
    } else {
        return res.status(403).json({
            error: { message: "Incorrect password." },
        });
    }
};

/**
 * Registers a new user after validating and checking for duplicates.
 *
 * @param req - Express request object containing name, email, and password.
 * @param res - Express response object with success message or error.
 */
export const userSignup = async (req: Request, res: Response) => {
    try {
        await Promise.all(userSignupValidationRules().map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: "Invalid details, please check your input" } });
        }

        const { name, email, password } = req.body;
        const sanitizedName = name.trim();

        const existingUser = await User.getUserByName(sanitizedName);
        if (existingUser) {
            return res.status(400).json({ error: { message: "username not available" } });
        }

        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 12),
            role: "user",
        });

        await User.create(newUser);

        return res.status(201).json({ message: "Successfully registered." });
    } catch (err) {
        Logger.error(err);
        return res.status(500).json({ error: { message: `Some Error` } });
    }
};

/**
 * Retrieves user information from the session context.
 *
 * @param req - Express request object with session context.
 * @param res - Express response object with user info or error.
 */
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.getUserByName(<string>req.context?.name);
        if (!user) {
            return res.status(404).json({ error: { message: "User not found" } });
        }
        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (err) {
        Logger.error(err);
        return res.status(500).json({ error: { message: `Some Error` } });
    }
};

/**
 * Logs out the current user by destroying their session.
 *
 * @param req - Express request object with session.
 * @param res - Express response object indicating logout status.
 */
export const logoutUser = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({error: {message: "Couldn't log you out please retry"}});
        } else {
            res.status(200).json({message: "Logged out successfully."});
        }
    });
};
