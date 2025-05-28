/**
 * This module defines the functions to interact with the REST APIs for the questions service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType } from "../types/entityTypes";

// The base URL for the questions API
const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * Fetches a list of questions from the server based on order and search query.
 *
 * @param {string} order - The display order of questions (e.g., "newest", "active", "unanswered"). Defaults to "newest".
 * @param {string} search - Search query entered by the user. Defaults to "".
 * @param {string} csrfToken - CSRF token used for secure API access.
 *
 * @returns {Promise<QuestionResponseType[]>} - A promise resolving to a list of matching questions.
 *
 * @throws Will throw an error if the API call fails or returns a non-200 status.
 */
const getQuestionsByFilter = async (
    order = "newest",
    search = "",
    csrfToken: string,
): Promise<QuestionResponseType[]> => {
  try {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`,
        {
          headers: {
            'x-csrf-token': `${csrfToken}`,
          },
        }
    );
    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * Fetches a single question by its ID.
 *
 * @param {string} qid - The ID of the question to retrieve.
 * @param {string} csrfToken - CSRF token for secure access.
 *
 * @returns {Promise<QuestionResponseType>} - A promise resolving to the fetched question object.
 *
 * @throws Will throw an error if the API call fails or returns a non-200 status.
 */
const getQuestionById = async (
    qid: string,
    csrfToken: string
): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`, {
      headers: {
        'x-csrf-token': `${csrfToken}`,
      },
    });
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * Submits a new question to the backend.
 *
 * @param {QuestionType} q - The question object containing title, text, and tags.
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @returns {Promise<QuestionResponseType>} - A promise resolving to the added question object.
 *
 * @throws Will throw an error if the API call fails or returns a non-200 status.
 */
const addQuestion = async (
    q: QuestionType,
    csrfToken: string
): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q, {
      headers: {
        'x-csrf-token': `${csrfToken}`,
      },
    });
    if (res.status !== 200) {
      throw new Error("Error while creating a new question");
    }

    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

/**
 * Deletes a question by its ID.
 *
 * @param {string} qid - The ID of the question to be deleted.
 * @param {string} csrfToken - CSRF token for secure API request.
 *
 * @returns {Promise<any>} - The response data from the API after deletion.
 *
 * @throws Will propagate any errors thrown during the API request.
 */
const delQuestion = async (qid: string, csrfToken: string) => {
  const res = await api.delete(`${QUESTION_API_URL}/deleteQuestionById/${qid}`, {
    headers: {
      'x-csrf-token': `${csrfToken}`,
    },
  });

  return res.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion, delQuestion };
