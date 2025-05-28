import mongoose from "mongoose";
import QuestionSchema from "./schema/question";
import {
    IQuestion,
    IQuestionDocument,
    IQuestionModel,
    IQuestionReq,
    IUserDocument
} from "../types/types";
import Answer from "./answers";
import {
    mapIAnswerDocumentToIAnswer, mapICommentDocumentToIComment,
    mapIQuestionDocumentToIQuestion,
    mapITagDBToITag
} from "../utils/type-cast-util";

/**
 * Mongoose model for the Question collection.
 */
const Question = mongoose.model<IQuestionDocument, IQuestionModel>(
    "Question",
    QuestionSchema
);

/**
 * Pre-hook for cascading deletes on related answers, comments, and votes when a question is deleted.
 */
QuestionSchema.pre('deleteOne', {document: false, query: true}, async function (next) {
    try {
        const question = await this.model.findOne(this.getFilter());
        if (!question) {
            // If the answer is not found, exit the pre-hook
            console.log("Question not found");
            return next(new Error("Question not found"));
        }

        // Delete associated answers
        await mongoose.model('Answer').deleteMany({_id: {$in: question.answers}});

        // Delete associated comments
        await mongoose.model('Comment').deleteMany({_id: {$in: question.comments}});

        // Delete associated votes
        await mongoose.model('Vote').deleteMany({parent_id: question._id, parent_type: 'question'});

        next();
    } catch (err) {
        next(err as Error);
    }
});

/**
 * Increments the view count of a question.
 * @async
 * @function incrementViews
 * @returns Updated question document.
 */
QuestionSchema.methods.incrementViews = async function () {
    this.views += 1;
    await this.save();
    return this;
};

/**
 * Adds an answer to the question's answers array.
 * @async
 * @function addAnswer
 * @param {mongoose.Types.ObjectId} answerId - The ObjectId of the answer.
 * @returns Updated question document.
 */
QuestionSchema.methods.addAnswer = async function (answerId: mongoose.Types.ObjectId) {
    this.answers.push(answerId);
    await this.save();
    return this;
};

/**
 * Virtual property to check if a question has answers.
 * @name hasAnswers
 * @type {boolean}
 */
QuestionSchema.virtual('hasAnswers').get(function () {
    if (!this.answers) {
        return false;
    }
    return this.answers.length > 0;
});

/**
 * Virtual property to get the most recent activity date of a question.
 * If there are no answers, it returns the question's ask_date_time.
 * @name mostRecentActivity
 * @type {Date}
 */
QuestionSchema.virtual('mostRecentActivity').get(function () {
    if(!this.answers || this.answers.length === 0){
        return this.ask_date_time;
    }
    return Answer.getLatestAnswerDate(this.answers);
});

/**
 * Retrieves the newest questions sorted by ask_date_time.
 * @async
 * @function getNewestQuestions
 * @returns Array of formatted question objects.
 */
Question.getNewestQuestions = async function () {
    const questions: IQuestionDocument[] = await this.find({}).sort({ ask_date_time: -1 })
        .populate("tags").populate("answers").populate("asked_by").exec();
    return mapIQuestionDocumentToIQuestion(questions);
};

/**
 * Retrieves unanswered questions sorted by ask_date_time.
 * @async
 * @function getUnansweredQuestions
 * @returns Array of formatted unanswered question objects.
 */
Question.getUnansweredQuestions = async function () {
    let questions: IQuestionDocument[] = await this.find().sort({ ask_date_time: -1 })
        .populate("tags").populate("answers").populate("asked_by").exec();
    questions = questions.map(question => question.toObject({ virtuals: true }));

    questions = questions.filter(question => {
        return !question.hasAnswers;
    });

    return mapIQuestionDocumentToIQuestion(questions);
};

/**
 * Retrieves active questions sorted by most recent activity date.
 * @async
 * @function getActiveQuestions
 * @returns Array of formatted active question objects.
 */
Question.getActiveQuestions = async function () {
    let questions: IQuestionDocument[] = await this.find().populate("tags").populate("asked_by").populate("answers").exec();

    questions = questions.map(question => question.toObject({ virtuals: true }));

    questions = questions.sort((a, b) =>
        b.mostRecentActivity.getTime() - a.mostRecentActivity.getTime());

    return mapIQuestionDocumentToIQuestion(questions);
};

/**
 * Finds a question by ID and increments its views.
 * @async
 * @function findByIdAndIncrementViews
 * @param {string} qid - The ID of the question.
 * @returns The updated question object or null if not found.
 */
Question.findByIdAndIncrementViews = async function (qid: string) {
    const question: IQuestionDocument | null = await this.findOneAndUpdate(
        { _id: qid },
        { $inc: { views: 1 } },
        { new: true }
    )
        .populate({
            path: 'answers',
            populate: [
                {path: 'comments', populate: {path: 'comment_by'}},
                {path: 'ans_by', select: 'name'},
            ]
        })
        .populate({
            path: 'comments',
            populate: { path: 'comment_by'}
        })
        .populate('tags')
        .populate('asked_by');

    if (!question) {
        return null;
    }

    return {
        _id: question._id.toString(),
        answers: mapIAnswerDocumentToIAnswer(question.answers),
        ask_date_time: question.ask_date_time,
        asked_by: (question.asked_by as IUserDocument).name,
        tags: mapITagDBToITag(question.tags),
        text: question.text,
        title: question.title,
        views: question.views,
        vote_count: question.vote_count,
        comments: mapICommentDocumentToIComment(question.comments),
    };
};

/**
 * Increments vote count of a question.
 */
Question.incrementVoteCount = function(questionId: string, count: number): Promise<IQuestionDocument | null> {
    return this.findOneAndUpdate(
        { _id: questionId },
        { $inc: { vote_count: count } },
        { new: true }
    );
};

/**
 * Adds a comment ID to top of question's comments array.
 */
Question.addAndPushCommentToTop = function(questionId: string, commentId: string): Promise<IQuestionDocument | null> {
    return this.findOneAndUpdate(
        { _id: questionId },
        { $push: { comments: { $each: [commentId], $position: 0 } } },
        { new: true }
    );
};

/**
 * Adds an answer ID to top of question's answers array.
 */
Question.addAndPushAnswerToTop = function(questionId: string, answerId: string): Promise<IQuestionDocument | null> {
    return this.findOneAndUpdate(
        { _id: questionId },
        { $push: { answers: { $each: [answerId], $position: 0 } } },
        { new: true }
    );
};

/**
 * Removes a comment from the question.
 */
Question.removeComment = function(questionId: string, commentId: string): Promise<unknown> {
    return this.findOneAndUpdate(
        { _id: questionId },
        { $pull: { comments: commentId } },
        { new: true }
    );
};

/**
 * Creates a new question document.
 */
Question.createQuestion = function(questionData: IQuestionReq): Promise<IQuestionDocument> {
    return this.create(questionData);
};

/**
 * Deletes a question by ID.
 */
Question.deleteQuestion = async function(questionId: string) {
    return this.deleteOne({_id: questionId});
}

/**
 * Finds a question by ID.
 */
Question.findQuestionById = function(questionId: string) : Promise<IQuestionDocument | null> {
    return this.findOne({_id: questionId});
}

/**
 * Gets questions by order (newest, unanswered, active).
 */
Question.getQuestionsByOrder = async function (order: string): Promise<IQuestion[]> {
    if (!order || order.toLowerCase() === 'newest') {
        return await Question.getNewestQuestions();
    } else if (order.toLowerCase() === 'unanswered') {
        return await Question.getUnansweredQuestions();
    } else {
        return await Question.getActiveQuestions();
    }
}

/**
 * Fetches all questions with populated tags.
 */
Question.getQuestionsWithTags = async function() : Promise<IQuestionDocument[]> {
    return this.find().populate('tags').lean();
}

export default Question;