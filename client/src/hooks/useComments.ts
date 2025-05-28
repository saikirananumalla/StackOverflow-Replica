import { useState } from "react";

/**
 * Custom React hook to manage the visibility of comments on a post.
 * It allows toggling between showing a limited number of comments
 * and displaying all available comments.
 *
 * @returns {{
 *   showAllComments: boolean,
 *   setShowAllComments: (val: boolean) => void,
 *   toggleShowAllComments: () => void
 * }} - State and handlers for comment visibility.
 */
export const useComments = () => {
    const [showAllComments, setShowAllComments] = useState(false);

    /**
     * Toggles the state of `showAllComments` between true and false.
     */
    const toggleShowAllComments = () => {
        setShowAllComments(!showAllComments);
    };

    return { showAllComments, setShowAllComments, toggleShowAllComments };
};
