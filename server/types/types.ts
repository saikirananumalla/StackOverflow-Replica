import mongoose from "mongoose";
import {
  IAnswerDB,
  ICommentDB,
  IQuestionDB,
  ITagDB,
  IUserDB,
  IVoteDB
} from "../scripts/script_types";
import { Request } from 'express';
import {DeleteResult} from "mongodb";

/**
 * Extends the Express Request object to define the expected shape for question creation requests.
 */
export interface IQuestionReq extends Request {
  title: string;
  text: string;
  tags: ITag[];
  asked_by?: string;
  ask_date_time: Date;
}

/**
 * Interface representing the request body for adding an answer.
 */
export interface IAnswerRequest {
  /**
   * The ID of the question to which the answer belongs.
   */
  qid: string;

  /**
   * The answer details.
   */
  ans: {
    /**
     * The text content of the answer.
     */
    text: string;

    /**
     * The user who provided the answer.
     */
    ans_by: string;

    /**
     * The timestamp when the answer was created.
     */
    ans_date_time: Date;
  };
}

/**
 * Represents a tag count object.
 */
export interface ITagCount {
  /**
   * The name of the tag.
   */
  name: string;

  /**
   * The number of questions associated with this tag.
   */
  qcnt: number;
}

/**
 * Represents a question object returned from the Questions collection.
 */
export interface IQuestion {
  _id?: string;
  title: string;
  text: string;
  tags: ITag[];
  answers?: (IAnswer | mongoose.Types.ObjectId)[];
  comments?: (IComment | mongoose.Types.ObjectId)[];
  asked_by?: string;
  ask_date_time: Date;
  views: number;
  vote_count: number;
}

/**
 * Represents an answer object returned from the Answers collection.
 */
export interface IAnswer {
  _id?: string;
  text: string;
  comments: (IComment | mongoose.Types.ObjectId)[];
  ans_by: string;
  ans_date_time: Date;
  vote_count: number;
}

/**
 * Represents a comment object returned from the Comments collection.
 */
export interface IComment {
  _id?: string;
  text: string;
  comment_by: string;
  comment_date_time: Date;
  vote_count: number;
}

/**
 * Represents a tag object returned from the Tags collection.
 */
export interface ITag {
  _id?: string;
  name: string;
}

/**
 * Represents a user object returned from the Tags collection.
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Represents a vote object returned from the Votes collection.
 */
export interface IVote {
  _id: string;
  voted_by: string;
  vote_type: string;
  parent_id: string;
  parent_type: string;
}

/**
 * Represents a tag document schema in the database.
 */
export interface ITagDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<ITagDB, "_id"> {
  /**
   * The unique identifier of the tag.
   */
  _id: mongoose.Types.ObjectId;
}

/**
 * Represents a user document schema in the database.
 */
export interface IUserDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<IUserDB, "_id"> {
  /**
   * The unique identifier of the user.
   */
  _id: mongoose.Types.ObjectId;
}

/**
 * Represents a question document schema in the database.
 */
export interface IQuestionDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<IQuestionDB, "_id" | "answers" | "asked_by" | "comments"> {
  /**
   * The unique identifier of the question.
   */
  _id: mongoose.Types.ObjectId;

  /**
   * The list of answers associated with the question.
   */
  answers: mongoose.Types.Array<mongoose.Types.ObjectId | IAnswerDocument>;

  /**
   * The list of comments associated with the question.
   */
  comments: mongoose.Types.Array<mongoose.Types.ObjectId | ICommentDocument>;

  /**
   * User who asked this question
   */
  asked_by: mongoose.Types.ObjectId | IUserDocument;

  /**
   * Increments the view count of the question.
   *
   * @returns {Promise<IQuestionDocument>} The updated question document.
   */
  incrementViews(): Promise<IQuestionDocument>;

  /**
   * Adds an answer to the question.
   *
   * @param {mongoose.Types.ObjectId} answerId - The ID of the answer to add.
   * @returns {Promise<IQuestionDocument>} The updated question document.
   */
  addAnswer(answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument>;

  /**
   * Indicates whether the question has any answers.
   */
  hasAnswers: boolean;

  /**
   * The timestamp of the most recent activity (either the question itself or the latest answer).
   */
  mostRecentActivity: Date;
}

/**
 * Represents an answer document schema in the database.
 */
export interface IAnswerDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<IAnswerDB, "_id" | "comments" | "ans_by"> {
  /**
   * The unique identifier of the answer.
   */
  _id: mongoose.Types.ObjectId;

  /**
   * The list of comments associated with the answer.
   */
  comments: mongoose.Types.Array<mongoose.Types.ObjectId | ICommentDocument>;

  /**
   * User who answered this
   */
  ans_by: mongoose.Types.ObjectId | IUserDocument;
}

/**
 * Represents a comment document schema in the database.
 */
export interface ICommentDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<ICommentDB, "_id" | "comment_by"> {
  /**
   * The unique identifier of the comment.
   */
  _id: mongoose.Types.ObjectId;

  /**
   * User who commented this
   */
  comment_by: mongoose.Types.ObjectId | IUserDocument;
}

/**
 * Represents a vote document schema in the database.
 */
export interface IVoteDocument
    extends Omit<mongoose.Document, "_id">,
        Omit<IVoteDB, "_id"> {
  /**
   * The unique identifier of the vote.
   */
  _id: mongoose.Types.ObjectId;
}

/**
 * Represents the model for the Questions collection.
 */
export interface IQuestionModel extends mongoose.Model<IQuestionDocument> {
  /**
   * Retrieves the newest questions sorted by ask date-time in descending order.
   *
   * @returns {Promise<IQuestion[]>} A promise resolving to an array of newest questions.
   */
  getNewestQuestions(): Promise<IQuestion[]>;

  /**
   * Retrieves unanswered questions that have no answers.
   *
   * @returns {Promise<IQuestion[]>} A promise resolving to an array of unanswered questions.
   */
  getUnansweredQuestions(): Promise<IQuestion[]>;

  /**
   * Retrieves the most active questions sorted by most recent activity.
   *
   * @returns {Promise<IQuestion[]>} A promise resolving to an array of active questions.
   */
  getActiveQuestions(): Promise<IQuestion[]>;

  /**
   * Finds a question by ID and increments its view count.
   *
   * @param {string} qid - The ID of the question.
   * @returns {Promise<IQuestion | null>} A promise resolving to the updated question object or `null` if not found.
   */
  findByIdAndIncrementViews(qid: string): Promise<IQuestion | null>;

  /**
   * Returns questions in the order specified.
   *
   * @param {string} order - The desired ordering: 'newest', 'unanswered', or 'active'.
   * @returns {Promise<IQuestion[]>} A promise resolving to the ordered list of questions.
   */
  getQuestionsByOrder(order: string): Promise<IQuestion[]>;

  /**
   * Increments vote count of a question.
   *
   * @param {string} questionId - ID of the question.
   * @param {number} count - Vote delta (positive or negative).
   * @returns {Promise<IQuestionDocument | null>} The updated question document or null.
   */
  incrementVoteCount(questionId: string, count: number): Promise<IQuestionDocument | null>;

  /**
   * Pushes a comment ID to the top of a question's comment list.
   *
   * @param {string} questionId - ID of the question.
   * @param {string} commentId - ID of the comment to add.
   * @returns {Promise<IQuestionDocument | null>} The updated question document or null.
   */
  addAndPushCommentToTop(questionId: string, commentId: string): Promise<IQuestionDocument | null>;

  /**
   * Removes a comment from a question.
   *
   * @param {string} questionId - ID of the question.
   * @param {string} commentId - ID of the comment to remove.
   * @returns {Promise<unknown>} A promise resolving when the operation is complete.
   */
  removeComment(questionId: string, commentId: string): Promise<unknown>;

  /**
   * Pushes an answer ID to the top of a question's answers array.
   *
   * @param {string} questionId - ID of the question.
   * @param {string} answerId - ID of the answer to add.
   * @returns {Promise<IQuestionDocument | null>} The updated question document or null.
   */
  addAndPushAnswerToTop(questionId: string, answerId: string): Promise<IQuestionDocument | null>;

  /**
   * Creates a new question in the database.
   *
   * @param {IQuestionReq} questionData - The question creation payload.
   * @returns {Promise<IQuestionDocument>} The newly created question document.
   */
  createQuestion(questionData: IQuestionReq): Promise<IQuestionDocument>;

  /**
   * Retrieves all questions along with their associated tags.
   *
   * @returns {Promise<IQuestionDocument[]>} List of questions with tag data populated.
   */
  getQuestionsWithTags() : Promise<IQuestionDocument[]>;

  /**
   * Deletes a question by its ID.
   *
   * @param {string} questionId - The ID of the question to delete.
   * @returns {Promise<DeleteResult>} Result of the deletion operation.
   */
  deleteQuestion(questionId: string): Promise<DeleteResult>;

  /**
   * Finds a question by ID.
   *
   * @param {string} questionId - The ID of the question to retrieve.
   * @returns {Promise<IQuestionDocument | null>} The question document if found, otherwise null.
   */
  findQuestionById(questionId: string) : Promise<IQuestionDocument | null>;
}

/**
 * Represents the model for the Tags collection.
 */
export interface ITagModel extends mongoose.Model<ITag> {
  /**
   * Finds existing tags by name or creates new tags if they do not exist.
   *
   * @param {string[]} tagNames - An array of tag names.
   * @returns {Promise<ITag[]>} A promise resolving to an array of tags.
   */
  findOrCreateMany(tagNames: string[]): Promise<ITag[]>;

  /**
   * Validates whether all provided tag IDs exist in the collection.
   *
   * @param {mongoose.Types.ObjectId[]} tagIds - An array of tag ObjectIds.
   * @returns {Promise<boolean>} A promise resolving to `true` if all tag IDs exist, otherwise `false`.
   */
  validateTags(tagIds: mongoose.Types.ObjectId[]): Promise<boolean>;

  /**
   * Retrieves all tags from the collection.
   *
   * @returns {Promise<ITagDocument[]>} A list of all tag documents.
   */
  getAllTags(): Promise<ITagDocument[]>;
}

/**
 * Represents the model for the Answers collection.
 */
export interface IAnswerModel extends mongoose.Model<IAnswerDocument> {
  /**
   * Retrieves the most recent answer from a list of answer IDs.
   *
   * @param {mongoose.Types.ObjectId[]} answers - The list of answer IDs.
   * @returns {Promise<IAnswerDocument[]>} A promise resolving to an array with the most recent answer document.
   */
  getMostRecent(answers: mongoose.Types.ObjectId[]): Promise<IAnswerDocument[]>;

  /**
   * Retrieves the latest answer date from a list of answer documents.
   *
   * @param {Array<IAnswerDB | object>} answers - The list of answers.
   * @returns {Date} The latest answer date.
   */
  getLatestAnswerDate(answers: Array<IAnswerDB | object>): Date;

  /**
   * Increments vote count for an answer.
   *
   * @param {string} answerId - The answer ID.
   * @param {number} count - Vote increment (positive or negative).
   * @returns {Promise<IAnswerDocument | null>} Updated answer or null.
   */
  incrementVoteCount(answerId: string, count: number): Promise<IAnswerDocument | null>;

  /**
   * Adds a comment to the top of the answer's comment list.
   *
   * @param {string} answerId - The answer ID.
   * @param {string} commentId - The comment ID to add.
   * @returns {Promise<IAnswerDocument | null>} Updated answer or null.
   */
  addAndPushCommentToTop(answerId: string, commentId: string): Promise<IAnswerDocument | null>;

  /**
   * Removes a comment from the answer.
   *
   * @param {string} answerId - The answer ID.
   * @param {string} commentId - The comment ID to remove.
   * @returns {Promise<unknown>} Promise resolving on completion.
   */
  removeComment(answerId: string, commentId: string): Promise<unknown>;

  /**
   * Creates a new answer document.
   *
   * @param {IAnswerRequest} answerData - Answer data to insert.
   * @returns {Promise<IAnswerDocument>} The created answer document.
   */
  createAnswer(answerData:  IAnswerRequest): Promise<IAnswerDocument>;

  /**
   * Deletes an answer by ID.
   *
   * @param {string} answerId - The answer ID to delete.
   * @returns {Promise<DeleteResult>} Result of deletion.
   */
  deleteAnswer(answerId: string): Promise<DeleteResult>;

  /**
   * Finds an answer by its ID.
   *
   * @param {string} answerId - The answer ID to search.
   * @returns {Promise<IAnswerDocument | null>} Found answer or null.
   */
  findAnswerById(answerId: string) : Promise<IAnswerDocument | null>;
}

/**
 * Represents the model for the comment collection.
 */
export interface ICommentModel extends mongoose.Model<ICommentDocument> {
  /**
   * Increments vote count for a comment.
   *
   * @param {string} commentId - Comment ID.
   * @param {number} count - Vote increment value.
   * @returns {Promise<ICommentDocument | null>} Updated comment or null.
   */
  incrementVoteCount(commentId: string, count: number): Promise<ICommentDocument | null>;

  /**
   * Creates a new comment document.
   *
   * @param {Partial<ICommentDocument>} commentData - Comment data.
   * @returns {Promise<ICommentDocument>} Newly created comment.
   */
  createComment(commentData: Partial<ICommentDocument>): Promise<ICommentDocument>;

  /**
   * Deletes a comment by ID.
   *
   * @param {string} commentId - ID of the comment to delete.
   * @returns {Promise<ICommentDocument | null>} Deleted comment or null.
   */
  deleteCommentById(commentId: string) : Promise<ICommentDocument | null>;
}

/**
 * Represents the model for the vote's collection.
 */
export interface IVoteModel extends mongoose.Model<IVoteDocument> {
  /**
   * Finds an existing vote by user and parent.
   *
   * @param {string} userId - User who voted.
   * @param {string} parentId - The ID of the parent entity (question, answer, or comment).
   * @param {string} parentType - Type of the parent entity.
   * @returns {Promise<IVoteDocument | null>} Vote if found, else null.
   */
  findVote(userId: string, parentId: string, parentType: string): Promise<IVoteDocument | null>;

  /**
   * Updates the type of existing vote.
   *
   * @param {IVoteDocument} voteDoc - The vote document to update.
   * @param {string} newType - New vote type ('up_vote' or 'down_vote').
   * @returns {Promise<void>}
   */
  updateVoteType(voteDoc: IVoteDocument, newType: string): Promise<void>;

  /**
   * Creates a new vote document.
   *
   * @param {string} voteType - Type of vote.
   * @param {string} userId - ID of the voter.
   * @param {string} parentId - ID of the parent item being voted on.
   * @param {string} parentType - Type of the parent (question, answer, comment).
   * @returns {Promise<void>}
   */
  createVote(voteType: string, userId: string, parentId: string, parentType: string): Promise<void>;
}

/**
 * Represents the model for the user's collection.
 */
export interface IUserModel extends mongoose.Model<IUserDocument> {
  /**
   * Retrieves a user matching the name. Name is unique.
   *
   */
  getUserByName(name: string): Promise<IUser | null>;
}