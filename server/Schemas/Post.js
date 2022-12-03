import mongoose from "mongoose";
import Comment from "./Comment";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date,
    required: true,
  },
});

export default mongoose.model("post", PostSchema);
