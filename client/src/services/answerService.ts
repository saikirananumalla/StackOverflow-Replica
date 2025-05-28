/**
 * This module defines the functions to interact with the REST APIs for the answers service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { AnswerType, AnswerResponseType } from "../types/entityTypes";

// The base URL for the answers API
const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

/**
 * Calls the API to add a new answer to a specific question.
 * Validates the response and returns the added answer object on success.
 *
 * @param {string} qid - The ID of the question to which the answer is being added.
 * @param {AnswerType} ans - The answer object containing answer content and metadata.
 * @param {string} csrfToken - CSRF token used for secure request headers.
 *
 * @returns {Promise<AnswerResponseType>} - The added answer object from the server response.
 *
 * @throws Will throw an error if the API response status is not 200 or if the request fails.
 */
const addAnswer = async (
    qid: string,
    ans: AnswerType,
    csrfToken: string,
): Promise<AnswerResponseType> => {
  const data = { qid: qid, ans: ans };
  try {
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data, {
      headers: {
        'x-csrf-token': `${csrfToken}`,
      },
    });
    if (res.status !== 200) {
      throw new Error("Error while creating a new answer");
    }
    return res.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

/**
 * Calls the API to delete an answer by its ID.
 *
 * @param {string} aid - The ID of the answer to be deleted.
 * @param {string} csrfToken - CSRF token used for secure request headers.
 *
 * @returns {Promise<any>} - The response data from the delete request.
 *
 * @throws Will propagate any error thrown during the API call.
 */
const delAnswer = async (aid: string, csrfToken: string) => {
  const res = await api.delete(`${ANSWER_API_URL}/deleteAnswerById/${aid}`, {
    headers: {
      'x-csrf-token': `${csrfToken}`,
    },
  });

  return res.data;
};

export { addAnswer, delAnswer };
