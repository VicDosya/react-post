import mongoose, { Schema } from "mongoose";

const PostVoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  vote: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("vote", PostVoteSchema);
