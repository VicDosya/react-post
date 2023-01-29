import mongoose from "mongoose";
export type UserType = {
  _id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  password: string;
  createdAt: string;
};
