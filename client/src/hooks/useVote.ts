import { useState } from "react";
import { voteParent } from "../services/voteService";
import { StringFunctionType } from "../types/functionTypes";
import { AxiosError } from "axios";

/**
 * Custom hook to manage vote interactions (upvote/downvote) for a given post (question, answer, or comment).
 * Handles voting logic, updates vote count, and displays error messages using a provided error handler.
 *
 * @param {string} parentId - The ID of the item being voted on (question, answer, or comment).
 * @param {string} parentType - The type of the item (e.g., "question", "answer", or "comment").
 * @param {string} csrfToken - CSRF token for secure backend API calls.
 * @param {number} numberOfVotes - The initial number of votes for the item.
 * @param {StringFunctionType} handleError - Callback to handle and display error messages.
 *
 * @returns {{
 *   votes: number,
 *   handleVote: (voteType: string) => Promise<void>
 * }} - Current vote count and the function to submit a vote.
 */
const useVote = (
    parentId: string,
    parentType: string,
    csrfToken: string,
    numberOfVotes: number,
    handleError: StringFunctionType
) => {
    const [votes, setVotes] = useState(numberOfVotes || 0);

    /**
     * Handles the voting logic by calling the backend vote service.
     * Updates local vote count on success or calls `handleError` on failure.
     *
     * @param {string} voteType - Type of vote ("up_vote" or "down_vote").
     */
    const handleVote = async (voteType: string) => {
        try {
            const response = await voteParent(parentId, parentType, voteType, csrfToken);

            if (response.data) {
                const newVotes = response.data.vote_count;
                setVotes(newVotes);
            } else {
                handleError(response.data.error.message);
            }
        } catch (err) {
            console.log((err as AxiosError).message);
            if (err instanceof AxiosError) {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error &&
                    err.response.data.error.message
                ) {
                    handleError(err.response.data.error.message);
                } else {
                    handleError("something went wrong");
                }
            } else {
                handleError("something went wrong");
            }
        }
    };

    return {
        votes,
        handleVote,
    };
};

export default useVote;
