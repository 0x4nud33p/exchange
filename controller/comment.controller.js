import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const addComment = async (req, res) => {
  const { text, postId } = req.body;
  const userId = req.user.userId;

  if (!text) {
    return res.status(400).json({ message: "Text field should not be empty" });
  }

  try {
    const newComment = new Comment({ text, postId, createdBy: userId });
    await newComment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};
