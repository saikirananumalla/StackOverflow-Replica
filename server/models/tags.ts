import mongoose from "mongoose";
import TagSchema from "./schema/tag";
import { ITag, ITagDocument, ITagModel } from "../types/types";

/**
 * Mongoose model for handling tag documents.
 */
export const Tag = mongoose.model<ITagDocument, ITagModel>("Tag", TagSchema);

/**
 * Finds existing tags by their names or creates new ones if they do not exist.
 *
 * @param {string[]} tagNames - An array of tag names to find or create.
 * @returns {Promise<ITag[]>} A promise resolving to an array of tags.
 * @throws {Error} Throws an error if the operation fails.
 */
Tag.findOrCreateMany = async function (tagNames: string[]): Promise<ITag[]> {
    try {
        // Find existing tags by name
        const existingTags: ITagDocument[] = await this.find({ name: { $in: tagNames } });
        const existingTagNames = existingTags.map(tag => tag.name);

        // Filter out names that do not exist in the database
        const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

        // Create new tags if needed
        if (newTagNames.length !== 0) {
            const createdTags = newTagNames.map(name => ({ name }));
            await this.insertMany(createdTags);
        }

        // Retrieve and return all requested tags (both existing and newly created)
        return this.find({ name: { $in: tagNames } });
    } catch (error) {
        console.error("Error in findOrCreateMany:", error);
        throw new Error("Failed to find or create tags");
    }
};

/**
 * Validates if all provided tag IDs exist in the database.
 *
 * @param {mongoose.Types.ObjectId[]} tagIds - An array of tag ObjectIds to validate.
 * @returns {Promise<boolean>} A promise resolving to `true` if all tag IDs exist, otherwise `false`.
 */
Tag.validateTags = async function (tagIds: mongoose.Types.ObjectId[]): Promise<boolean> {
    const count = await this.countDocuments({ _id: { $in: tagIds } });
    return count === tagIds.length;
};

/**
 * Gets all the tags in the database.
 */
Tag.getAllTags = async function (): Promise<ITagDocument[]> {
    return this.find();
};

export default Tag;
