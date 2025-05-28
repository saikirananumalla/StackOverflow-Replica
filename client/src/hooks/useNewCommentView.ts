import { useState } from "react";
import { validateHyperlink } from "../utils";
import { commentParent } from "../services/commentService";
import { IdFunctionType } from "../types/functionTypes";

/**
 * Custom hook for handling the creation of a new comment.
 * Validates the comment text and hyperlink format before submission.
 * On success, refreshes the answer or question page using `handleAnswer`.
 *
 * @param {IdFunctionType} handleAnswer - Callback function to refresh the relevant question page.
 * @param {string} qid - ID of the question associated with the comment.
 * @param {string} pid - ID of the parent (question or answer) being commented on.
 * @param {string} parent - Type of the parent ("question" or "answer").
 * @param {string} csrfToken - CSRF token for secure backend communication.
 *
 * @returns {{
 *   text: string,
 *   textErr: string,
 *   setText: (val: string) => void,
 *   setTextErr: (val: string) => void,
 *   postComment: () => Promise<void>
 * }} - State and handlers for managing comment form behavior.
 */
export const useNewCommentView = (
    handleAnswer: IdFunctionType,
    qid: string,
    pid: string,
    parent: string,
    csrfToken: string
) => {
    const [text, setText] = useState("");
    const [textErr, setTextErr] = useState("");

    /**
     * Validates and submits the comment.
     * Ensures comment is not empty and contains valid hyperlinks.
     * On successful submission, refreshes the page using `handleAnswer`.
     */
    const postComment = async () => {
        setTextErr("");
        let isValid = true;

        if (!text) {
            setTextErr("Comment text cannot be empty");
            isValid = false;
        }

        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const res = await commentParent(pid, parent, text, csrfToken);
        if (res && res._id) {
            handleAnswer(qid);
        }
    };

    return { text, textErr, setTextErr, setText, postComment };
};
