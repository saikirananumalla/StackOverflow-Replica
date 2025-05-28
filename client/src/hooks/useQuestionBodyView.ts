import { useEffect, useState } from "react";

/**
 * Custom hook to determine when vote data has been successfully loaded
 * for rendering the vote buttons on a question.
 *
 * @param {number} votes - The current vote count for the question.
 *
 * @returns {{
 *   votesLoaded: boolean
 * }} - A flag indicating whether the vote data is loaded and ready for display.
 */
export const useQuestionBodyView = (votes: number) => {
    const [votesLoaded, setVotesLoaded] = useState(false);

    /**
     * When the `votes` value is available, mark the data as loaded.
     */
    useEffect(() => {
        if (votes !== undefined) {
            setVotesLoaded(true);
        }
    }, [votes]);

    return { votesLoaded };
};
