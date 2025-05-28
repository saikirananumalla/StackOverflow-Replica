import mongoose from "mongoose";
import {ICommentDocument, ICommentModel} from "../../types/types";


/**
 * The schema for a document in the Comment collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ICommentDocument and ICommentModel.
 * ICommentDocument is used to define the instance methods of the Comment document.
 * ICommentModel is used to define the static methods of the Comment model.
 */
const CommentSchema = new mongoose.Schema<ICommentDocument, ICommentModel> (
    {
        text: {type: String, required: true},
        comment_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        comment_date_time: {type: Date, required: true},
        vote_count: {type: Number, required: true, default: 0}
    },
    {collection: "Comment"}
);

export default CommentSchema;