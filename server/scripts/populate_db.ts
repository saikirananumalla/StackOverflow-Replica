// Run this script to test your schema
// Start the MongoDB service as a background process before running the script
// Pass the URL of your MongoDB instance as the first argument (e.g., mongodb://127.0.0.1:27017/fake_so)

import mongoose from "mongoose";
import Answer from "../models/answers";
import Question from "../models/questions";
import Tag from "../models/tags";
import {IAnswerDB, ICommentDB, IQuestionDB, ITagDB, IUserDB} from "./script_types";
import {
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
} from "../data/posts_strings";
import User from "../models/users";
import Comment from "../models/comments";

// Get arguments passed on the command line
const userArgs = process.argv.slice(2);

// Check if user has passed a valid MongoDB URL
if (!userArgs[0].startsWith("mongodb")) {
  console.log(
      "ERROR: You need to specify a valid MongoDB URL as the first argument"
  );
  process.exit(1);
}

// Connect to the MongoDB instance using the provided URL
const mongoDB = userArgs[0];

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/**
 * Creates a new tag in the Tags collection.
 *
 * @param {string} name - The name of the tag.
 * @returns {Promise<ITagDB>} A promise that resolves to the created tag object.
 */
async function tagCreate(name: string): Promise<ITagDB> {
  const tagDoc = await new Tag({ name }).save();

  return {
    _id: new mongoose.Types.ObjectId(tagDoc._id),
    name: tagDoc.name,
  };
}

/**
 * Creates a new user in the Users collection.
 *
 * @param {string} name - The name of the user.
 * @param email - user email address
 * @param password - secret password
 * @param role - mod or user
 * @returns {Promise<ITagDB>} A promise that resolves to the created tag object.
 */
async function userCreate(name: string, email: string, password: string, role: string): Promise<IUserDB> {
  const userDetail = {
    name: name,
    email: email,
    password: password,
    role: role
  }

  const user = new User(userDetail);
  return user.save();
}

/**
 * Creates a new answer in the Answers collection.
 *
 * @param {string} text - The text of the answer.
 * @param {string} ans_by - The username of the user who provided the answer.
 * @param {Date} ans_date_time - The date and time when the answer was posted.
 * @param comments comments
 * @param vote_count total votes
 * @returns {Promise<IAnswerDB>} A promise that resolves to the created answer object.
 */
async function answerCreate(
    text: string,
    ans_by: string,
    ans_date_time: Date,
    comments: ICommentDB[],
    vote_count: number,
): Promise<IAnswerDB> {
  const answerDetail: IAnswerDB = { text: text, ans_by: new mongoose.Types.ObjectId(ans_by),
    ans_date_time: ans_date_time, comments: comments, vote_count: vote_count };
  const answer = await new Answer(answerDetail).save();

  return {
    comments: [],
    _id: new mongoose.Types.ObjectId(answer._id),
    text: answer.text,
    ans_by: answer.ans_by._id,
    ans_date_time: answer.ans_date_time,
    vote_count: answer.vote_count
  }
}

/**
 * Creates a new question in the Questions collection.
 *
 * @param {string} title - The title of the question.
 * @param {string} text - The text content of the question.
 * @param {ITagDB[]} tags - An array of tag objects associated with the question.
 * @param {IAnswerDB[]} answers - An array of answer objects associated with the question.
 * @param comments comments
 * @param {string} asked_by - The username of the user who asked the question.
 * @param {Date} ask_date_time - The date and time when the question was posted.
 * @param {number} views - The number of views the question has received.
 * @param vote_count total votes
 * @returns {Promise<IQuestionDB>} A promise that resolves to the created question object.
 */
async function questionCreate(
    title: string,
    text: string,
    tags: ITagDB[],
    answers: IAnswerDB[],
    comments: ICommentDB[],
    asked_by: string,
    ask_date_time: Date,
    views: number,
    vote_count: number,
): Promise<void> {

  const qstnDetail: IQuestionDB = {
    title: title,
    text: text,
    tags: tags,
    answers: answers,
    comments: comments,
    asked_by: new mongoose.Types.ObjectId(asked_by),
    ask_date_time: ask_date_time,
    views: views,
    vote_count: vote_count
  };

  await new Question(qstnDetail).save();
}

/**
 * Creates a new comment.
 */
async function commentCreate(text: string, comment_by: string, vote_count: number): Promise<ICommentDB> {
  const commentDetail = {
    text: text,
    comment_by: comment_by,
    vote_count: vote_count,
    comment_date_time: new Date()
  }

  const comment = await new Comment(commentDetail).save();
  return {
    _id: comment._id,
    text: comment.text,
    comment_by: comment.comment_by._id,
    comment_date_time: comment.comment_date_time,
    vote_count: comment.vote_count
  }
}

/**
 * Populates the database with predefined tags, answers, comments, and questions.
 */
const populate = async () => {
  try {
    const user1 = await userCreate('user1', 'user1@test.com', '$2b$12$FN6XF6wfWwELNEbaJNNqr.Zbpe6BaTpxUOzr45dZFwJsvQ4vjtLPK', 'user');
    const user2 = await userCreate('user2', 'user2@test.com', '$2b$12$FN6XF6wfWwELNEbaJNNqr.Zbpe6BaTpxUOzr45dZFwJsvQ4vjtLPK', 'user');
    const user3 = await userCreate('user3', 'user3@test.com', '$2b$12$FN6XF6wfWwELNEbaJNNqr.Zbpe6BaTpxUOzr45dZFwJsvQ4vjtLPK', 'mod');

    // Create tags
    const t1 = await tagCreate("react");
    const t2 = await tagCreate("javascript");
    const t3 = await tagCreate("android-studio");
    const t4 = await tagCreate("shared-preferences");
    const t5 = await tagCreate("storage");
    const t6 = await tagCreate("website");

    const c1 = await commentCreate("This is comment1", user1._id!.toString(), 10);
    const c2 = await commentCreate("This is comment2", user3._id!.toString(), 20);
    const c3 = await commentCreate("This is comment3", user3._id!.toString(), 20);
    const c4 = await commentCreate("This is comment4", user3._id!.toString(), 20);


    // Create answers
    const a1 = await answerCreate(A1_TXT, user1._id!.toString(), new Date("2023-11-20T03:24:42"), [c1], 12);
    const a2 = await answerCreate(A2_TXT, user2._id!.toString(), new Date("2023-11-23T08:24:00"), [c4], 1);
    const a3 = await answerCreate(A3_TXT, user3._id!.toString(), new Date("2023-11-18T09:24:00"), [], 2);
    const a4 = await answerCreate(A4_TXT, user1._id!.toString(), new Date("2023-11-12T03:30:00"), [c2], 1);
    const a5 = await answerCreate(A5_TXT, user2._id!.toString(), new Date("2023-11-01T15:24:19"), [], 5);
    const a6 = await answerCreate(A6_TXT, user3._id!.toString(), new Date("2023-02-19T18:20:59"), [], 0);
    const a7 = await answerCreate(A7_TXT, user1._id!.toString(), new Date("2023-02-22T17:19:00"), [], 0);
    const a8 = await answerCreate(A8_TXT, user2._id!.toString(), new Date("2023-03-22T21:17:53"), [], 1);

    // Create questions
    await questionCreate(Q1_DESC, Q1_TXT, [t1, t2], [a1, a2], [c3], user1._id!.toString(), new Date("2022-01-20T03:00:00"), 10, 11);
    await questionCreate(Q2_DESC, Q2_TXT, [t3, t4, t2], [a3, a4, a5], [], user2._id!.toString(), new Date("2023-01-10T11:24:30"), 121, 12);
    await questionCreate(Q3_DESC, Q3_TXT, [t5, t6], [a6, a7], [], user3._id!.toString(), new Date("2023-02-18T01:02:15"), 200, 0);
    await questionCreate(Q4_DESC, Q4_TXT, [t3, t4, t5], [a8], [], user2._id!.toString(), new Date("2023-03-10T14:28:01"), 103, 1);

    console.log("Database population completed successfully.");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    db.close();
  }
};

// Execute the populate function
populate();

console.log("Processing database population...");
