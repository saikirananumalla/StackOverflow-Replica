import mongoose from "mongoose";
import { IQuestionDocument, IQuestionModel } from "../../types/types";

/**
 * The schema for a document in the Question collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
*/
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
      title: {type: String, required: true},
      text: {type: String, required: true},
      asked_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      ask_date_time: {type: Date, required: true},
      views: {type: Number, required: true, default: 0},
      tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag', minLength: 1}],
      answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
      comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
      vote_count: {type: Number, required: true, default: 0}
  },
  { collection: "Question" }
);


export default QuestionSchema;
