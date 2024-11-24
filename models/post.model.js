import mongoose from "mongoose";
import { Comment } from "./comment.model.js";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  mediaUrl: { type: String, required: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required : false },
});

export const Post = mongoose.model("Post",postSchema)