import mongoose from "mongoose";

/**
 * These types define the structure of documents in the MongoDB collections.
 *
 * Unlike the types in `types.ts`, these explicitly use `mongoose.Types.ObjectId`
 * for the `_id` field, which aligns with Mongoose's internal representation.
 *
 * These types are primarily used in scripts for populating the database with test data.
 */

/**
 * Represents an answer document in the database.
 */
export interface IAnswerDB {
  /**
   * The unique identifier of the answer (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;

  /**
   * The text content of the answer.
   */
  text: string;

  /**
   * The username of the person who provided the answer.
   */
  ans_by: mongoose.Types.ObjectId;

  /**
   * The timestamp indicating when the answer was posted.
   */
  ans_date_time: Date;

  /**
   * An array of associated comments, which can be comment documents or references to comment IDs.
   */
  comments: (ICommentDB | mongoose.Types.ObjectId)[];

  /**
   * The total number of votes the answer has received.
   */
  vote_count: number;
}

/**
 * Represents a question document in the database.
 */
export interface IQuestionDB {
  /**
   * The unique identifier of the question (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;

  /**
   * The title of the question.
   */
  title: string;

  /**
   * The detailed text description of the question.
   */
  text: string;

  /**
   * An array of associated tags.
   */
  tags: ITagDB[];

  /**
   * An array of associated answers, which can be answer documents or references to answer IDs.
   */
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];

  /**
   * The username of the person who asked the question (optional).
   */
  asked_by: mongoose.Types.ObjectId;

  /**
   * The timestamp indicating when the question was posted.
   */
  ask_date_time: Date;

  /**
   * The number of views the question has received.
   */
  views: number;

  /**
   * An array of associated comments, which can be comment documents or references to comment IDs.
   */
  comments: (ICommentDB | mongoose.Types.ObjectId)[];

  /**
   * The total number of votes the question has received.
   */
  vote_count: number;
}

/**
 * Represents a tag document in the database.
 */
export interface ITagDB {
  /**
   * The unique identifier of the tag (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;

  /**
   * The name of the tag.
   */
  name: string;
}


/**
 * Represents a comment document in the database.
 */
export interface ICommentDB {
  /**
   * The unique identifier of the comment (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;

  /**
   * The text of the comment.
   */
  text: string;

  /**
   * Comment created by user id.
   */
  comment_by: mongoose.Types.ObjectId;

  /**
   * Date and time this comment was created.
   */
  comment_date_time: Date;

  /**
   * Number of votes for this comment.
   */
  vote_count: number;
}


/**
 * Represents a vote document in the database.
 */
export interface IVoteDB {
  /**
   * The unique identifier of the vote (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;

  /**
   * The type of the vote: up or down.
   */
  vote_type: string;

  /**
   * Vote created by user id.
   */
  voted_by: mongoose.Types.ObjectId;

  /**
   * Associated parent id.
   */
  parent_id: mongoose.Schema.Types.ObjectId;

  /**
   * Question, Answer or Comment.
   */
  parent_type: string;
}

/**
 * Represents a user document in the database.
 */
export interface IUserDB {
  /**
   * The unique identifier of the tag (optional, assigned by MongoDB).
   */
  _id?: mongoose.Types.ObjectId;
  /**
   * user name
   */
  name: string;
  /**
   * user's email address
   */
  email: string;
  /**
   * the secret password to login
   */
  password: string;
  /**
   * the role associated if mod
   */
  role: string;
}
