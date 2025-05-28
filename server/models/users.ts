import mongoose from "mongoose";
import UserSchema from "./schema/user";
import {IUser, IUserDocument, IUserModel} from "../types/types";
import {convertToIUser} from "../utils/type-cast-util";

/**
 * Mongoose model for handling user documents.
 */
export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

/**
 * Get a user document by name.
 * @param name username
 */
User.getUserByName = async function (name: string): Promise<IUser | null> {
    const user: IUserDocument | null = await this.findOne({name: name}).exec();
    return convertToIUser(user);
}

export default User;
