/**
 * This file contains all the function types used in the application.
 * Function types are used to define the functions that are passed as props to components.
 */

/**
 * Represents a function that takes no arguments and returns nothing.
 */
type VoidFunctionType = () => void;

/**
 * Represents a function that sets the question page with optional search string and title.
 */
type PageSetterFunctionType = (search?: string, title?: string) => void;

/**
 * Represents a function that takes a search query and a title to set filtered questions.
 */
type QuestionsPageQueryFuntionType = (query: string, title: string) => void;

/**
 * Represents a function that handles a tag click by passing the tag name.
 */
type ClickTagFunctionType = (tagName: string) => void;

/**
 * Represents a function that takes an ID string (e.g., question ID, answer ID).
 */
type IdFunctionType = (id: string) => void;

/**
 * Represents a function to set the order of displayed items (e.g., "Newest", "Active").
 */
type OrderFunctionType = (order: string) => void;

/**
 * Represents a function that accepts a message string (used for setting UI messages or statuses).
 */
type MessageFunctionType = (message: string) => void;

/**
 * Represents a function that acts on a question ID (e.g., for navigation or state updates).
 */
type QuestionIdFunctionType = (qid: string) => void;

/**
 * Represents a function that takes a string value (e.g., for setting error messages or form values).
 */
type StringFunctionType = (value: string) => void;

/**
 * Represents a function that accepts a boolean (e.g., for toggling login state or mod flag).
 */
type BooleanFunctionType = (value: boolean) => void;

/**
 * Represents a function to delete a comment based on question ID, parent ID, parent type, comment ID, and CSRF token.
 */
type DeleteCommentFunctionType = (
    qid: string,
    parentId: string,
    parentType: string,
    cid: string,
    csrfToken: string
) => void;

/**
 * Represents a function to add a comment to a given parent (question or answer).
 */
type CommentFunctionType = (
    parent_id: string,
    pq_id: string,
    parentType: string
) => void;

/**
 * Represents a function to delete a question by its ID and CSRF token.
 */
type DeleteQuestionFunctionType = (qid: string, csrfToken: string) => void;

/**
 * Represents a function to delete an answer by question ID, answer ID, and CSRF token.
 */
type DeleteAnswerFunctionType = (
    qid: string,
    aid: string,
    csrfToken: string
) => void;

export type {
  VoidFunctionType,
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  OrderFunctionType,
  MessageFunctionType,
  QuestionIdFunctionType,
  StringFunctionType,
  QuestionsPageQueryFuntionType,
  BooleanFunctionType,
  DeleteCommentFunctionType,
  CommentFunctionType,
  DeleteQuestionFunctionType,
  DeleteAnswerFunctionType,
};
