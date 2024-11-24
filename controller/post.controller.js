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

const getPaginatedPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    
    const skip = (page - 1) * limit;

   
    const posts = await Post.find()
      .skip(skip) 
      .limit(limit)
      .sort({ createdAt: -1 });

    
    const totalPosts = await Post.countDocuments();

    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      data: posts,
      metadata: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

export { createPost, getPosts, getPaginatedPosts};
