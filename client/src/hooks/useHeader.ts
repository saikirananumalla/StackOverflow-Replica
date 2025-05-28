import { ChangeEvent, KeyboardEvent, useState } from "react";
import { QuestionsPageQueryFuntionType } from "../types/functionTypes";

/**
 * Custom hook to manage the search bar logic in the header.
 *
 * @param {string} search - Initial search string to populate the input field.
 * @param {QuestionsPageQueryFuntionType} setQuestionPage - Function to trigger page update based on search input.
 *
 * @returns {{
 *   val: string,
 *   setVal: (val: string) => void,
 *   handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
 *   handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
 * }} - State and handlers for the search input field.
 */
export const useHeader = (
    search: string,
    setQuestionPage: QuestionsPageQueryFuntionType
) => {
    const [val, setVal] = useState<string>(search);

    /**
     * Handles input changes in the search bar.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
    };

    /**
     * Handles Enter key press to trigger a search.
     *
     * @param {KeyboardEvent<HTMLInputElement>} e - The key down event.
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setQuestionPage(e.currentTarget.value, "Search Results");
        }
    };

    return { val, setVal, handleInputChange, handleKeyDown };
};
