import mongoose, { Schema } from "mongoose";

const VoteDownSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  votes: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("voteDown", VoteDownSchema);
