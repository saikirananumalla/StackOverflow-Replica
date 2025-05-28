import mongoose from "mongoose";
import {IVoteDocument, IVoteModel} from "../../types/types";
import {ParentType, VoteType} from "../../types/enums";

/**
 * The schema for a document in the Vote collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IVoteDocument and IVoteModel.
 * IVoteDocument is used to define the instance methods of the Vote document.
 * IVoteModel is used to define the static methods of the Vote model.
 */
const VoteSchema = new mongoose.Schema<IVoteDocument, IVoteModel> (
    {
        vote_type: {type: String, enum: Object.values(VoteType), required: true,},
        voted_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        parent_id: {type: String, required: true},
        parent_type: {type: String, enum: Object.values(ParentType), required: true}
    },
    { collection: "Vote" }
);

export default VoteSchema;