import mongoose from "mongoose";
import {IUserDocument, IUser} from "../../types/types";

/**
 * The schema for a document in the Users collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IUserDocument and IUser.
 */
const UserSchema = new mongoose.Schema<IUserDocument, IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true}
    },
    { collection: "User" }
);

export default UserSchema;