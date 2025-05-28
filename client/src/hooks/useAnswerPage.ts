import { useEffect, useState } from "react";
import { getQuestionById } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";

/**
 * Custom React hook to manage the logic and data fetching for the Answer Page.
 * It fetches a question by its ID and manages error handling and snackbar display.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {number} rid - A refresh ID used to re-trigger the effect when changed.
 * @param {string} csrfToken - The CSRF token for secure API calls.
 *
 * @returns {{
 *   question: QuestionResponseType | null,
 *   handleError: (msg: string) => void,
 *   errorMessage: string,
 *   openSnackbar: boolean,
 *   dismissSnackbar: () => void
 * }} - An object containing the fetched question, error handling functions, and snackbar state.
 */
export const useAnswerPage = (
    qid: string,
    rid: number,
    csrfToken: string
) => {
  const [question, setQuestion] = useState<QuestionResponseType | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  /**
   * Dismisses the snackbar and clears the error message.
   */
  const dismissSnackbar = () => {
    setErrorMessage('');
    setOpenSnackbar(false);
  };

  /**
   * Sets an error message and opens the snackbar.
   * @param {string} msg - The message to display in the snackbar.
   */
  const handleError = (msg: string) => {
    setErrorMessage(msg);
    setOpenSnackbar(true);
  };

  /**
   * Fetches the question from the backend based on `qid`.
   * Triggered on component mount or whenever `qid`, `csrfToken`, or `rid` change.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionById(qid, csrfToken);
        setQuestion(res || null);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchData();
  }, [csrfToken, qid, rid]);

  return { question, handleError, errorMessage, openSnackbar, dismissSnackbar };
};
