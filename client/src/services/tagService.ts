/**
 * The module defines the functions to interact with the REST APIs for the tags service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { TagResponseType } from "../types/entityTypes";

// The base URL for the tags API
const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

/**
 * Fetches all tags along with the number of questions associated with each tag.
 *
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @returns {Promise<TagResponseType[]>} - A promise that resolves to a list of tags and their question counts.
 *
 * @throws Will throw an error if the API call fails or the response status is not 200.
 */
const getTagsWithQuestionNumber = async (csrfToken: string): Promise<TagResponseType[]> => {
    try {
        const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`, {
            headers: {
                'x-csrf-token': `${csrfToken}`,
            },
        });
        if (res.status !== 200) {
            throw new Error("Error when fetching tags with question number");
        }
        return res.data;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};

export { getTagsWithQuestionNumber };
