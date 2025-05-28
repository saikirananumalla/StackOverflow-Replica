import { api, REACT_APP_API_URL } from "./config";

// Base URL for vote-related API operations
const VOTE_API_URL = `${REACT_APP_API_URL}`;

/**
 * Sends a vote request (upvote or downvote) for a specified parent entity (question, answer, or comment).
 *
 * @param {string} parentId - The ID of the entity to vote on.
 * @param {string} parentType - The type of entity (e.g., "question", "answer", or "comment").
 * @param {string} voteType - The type of vote to cast ("up_vote" or "down_vote").
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @throws Will propagate any error returned by the API call.
 */
const voteParent = async (
    parentId: string,
    parentType: string,
    voteType: string,
    csrfToken: string
) => {
    const voteUrl = `${VOTE_API_URL}/vote/${parentType}/${parentId}`;
    return await api.patch(
        voteUrl,
        {},
        {
            params: { vote: voteType },
            headers: {
                'x-csrf-token': csrfToken,
            },
        }
    );
};

export { voteParent };
