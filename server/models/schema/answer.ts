import mongoose from "mongoose";
import { IAnswerDocument, IAnswerModel } from "../../types/types";

/**
 * The schema for a document in the Answer collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel> (
  {
      text: {type: String, required: true},
      ans_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
      ans_date_time: {type: Date},
      comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
      vote_count: {type: Number, required: true, default: 0}
  },
  { collection: "Answer" }
);

export default AnswerSchema;
