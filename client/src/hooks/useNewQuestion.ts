import { useState } from "react";
import { addQuestion } from "../services/questionService";
import { VoidFunctionType } from "../types/functionTypes";
import { validateHyperlink } from "../utils";

/**
 * Custom hook to handle the state and logic for creating a new question.
 * Validates title, text, and tags before submitting the new question to the backend.
 * If submission is successful, triggers the parent callback to refresh the question list.
 *
 * @param {VoidFunctionType} handleQuestions - Callback function to refresh the question list on the home page.
 * @param {string} csrfToken - CSRF token for secure backend communication.
 *
 * @returns {{
 *   title: string,
 *   setTitle: (val: string) => void,
 *   text: string,
 *   setText: (val: string) => void,
 *   tag: string,
 *   setTag: (val: string) => void,
 *   usrn: string,
 *   setUsrn: (val: string) => void,
 *   titleErr: string,
 *   textErr: string,
 *   tagErr: string,
 *   postQuestion: () => Promise<void>
 * }} - Question form state and control handlers.
 */
export const useNewQuestion = (handleQuestions: VoidFunctionType, csrfToken: string) => {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [usrn, setUsrn] = useState<string>("");

  const [titleErr, setTitleErr] = useState<string>("");
  const [textErr, setTextErr] = useState<string>("");
  const [tagErr, setTagErr] = useState<string>("");

  /**
   * Validates the form fields and submits the new question.
   * Displays appropriate error messages if validation fails.
   * On success, triggers `handleQuestions` to reload the question list.
   */
  const postQuestion = async () => {
    let isValid = true;

    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    if (!validateHyperlink(title)) {
      setTitleErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least one tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("More than five tags is not allowed");
      isValid = false;
    }

    for (const tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    const tagObjects = tags.map((tag) => ({ name: tag }));

    if (!isValid) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tagObjects,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question, csrfToken);
    if (res && res._id) {
      handleQuestions();
    }
  };

  return {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    usrn,
    setUsrn,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  };
};
