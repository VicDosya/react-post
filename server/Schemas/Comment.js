import mongoose from "mongoose";

const Comment = new mongoose.Schema({
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

export default Comment;
