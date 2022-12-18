import mongoose, { Schema } from "mongoose";

const Comment = new mongoose.Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  userId: {
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

export default mongoose.model("comment", Comment);
