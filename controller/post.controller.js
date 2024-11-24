import { Post } from "../models/post.model.js";

const createPost = async (req, res) => {
  const { text, mediaUrl } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    const newPost = new Post({ text, mediaUrl, createdBy: userId });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name" },
      });
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
};

export { createPost, getPosts };
