import { useState } from "react";
import { addAnswer } from "../services/answerService";
import { QuestionIdFunctionType } from "../types/functionTypes";
import { validateHyperlink } from "../utils";

/**
 * Custom hook to handle the creation of a new answer for a specific question.
 * Includes validation for empty input and proper hyperlink formatting.
 * On success, the answer is submitted to the backend and the question page is reloaded.
 *
 * @param {string} qid - The ID of the question being answered.
 * @param {QuestionIdFunctionType} handleAnswer - Callback function to re-render the question page after a successful answer submission.
 * @param {string} csrfToken - CSRF token for secure API communication.
 *
 * @returns {{
 *   usrn: string,
 *   setUsrn: (val: string) => void,
 *   text: string,
 *   setText: (val: string) => void,
 *   textErr: string,
 *   postAnswer: () => Promise<void>
 * }} - State and handlers for managing the answer form.
 */
export const useNewAnswer = (
    qid: string,
    handleAnswer: QuestionIdFunctionType,
    csrfToken: string
) => {
  const [usrn, setUsrn] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");

  /**
   * Validates and submits the new answer.
   * Displays errors if the answer is empty or contains invalid hyperlinks.
   * On success, refreshes the question page.
   */
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer, csrfToken);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  return {
    usrn,
    setUsrn,
    text,
    setText,
    textErr,
    postAnswer,
  };
};
