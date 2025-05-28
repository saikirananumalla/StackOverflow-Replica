import { REACT_APP_API_URL, api } from "./config";

// Base URL for the comment API
const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

/**
 * Sends a request to add a comment to a specified parent entity (question or answer).
 *
 * @param {string} pid - The ID of the parent (question or answer) to which the comment is being added.
 * @param {string} parent - The type of the parent ("question" or "answer").
 * @param {string} text - The comment text to be submitted.
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @returns {Promise<any>} - The API response data containing the created comment.
 *
 * @throws Will propagate any error encountered during the API request.
 */
const commentParent = async (pid: string, parent: string, text: string, csrfToken: string) => {
    const data = { text: text };
    const commentUrl = `${COMMENT_API_URL}/addComment/${parent}/${pid}`;
    console.log(commentUrl);
    const res = await api.post(commentUrl, data, {
        headers: {
            'x-csrf-token': csrfToken,
        },
    });
    return res.data;
};

/**
 * Sends a request to delete a specific comment by its ID.
 *
 * @param {string} parentType - The type of parent entity ("question" or "answer").
 * @param {string} parentId - The ID of the parent entity the comment is associated with.
 * @param {string} commentId - The ID of the comment to be deleted.
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @throws Will propagate any error encountered during the API request.
 */
const delComment = async (
    parentType: string,
    parentId: string,
    commentId: string,
    csrfToken: string
) => {
    const res = await api.delete(
        `${COMMENT_API_URL}/deleteCommentById/${parentType}/${parentId}/comment/${commentId}`,
        {
            headers: {
                'x-csrf-token': `${csrfToken}`,
            },
        }
    );
    return res.data;
};

export { commentParent, delComment };
