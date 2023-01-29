import mongoose from "mongoose";
import Comment from "./Comment";

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
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
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("post", PostSchema);
