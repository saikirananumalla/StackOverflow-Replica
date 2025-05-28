import mongoose from "mongoose";
import { ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */
const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  {
      name: {type: String, required: true}
  },
  { collection: "Tag" }
);

export default TagSchema;
