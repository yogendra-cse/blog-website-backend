import Post from "../models/post.model.js";
export const createPost = async (req, res) => {
  try {
    const { title, summary, content, images } = req.body;
    // console.log("user details", req.user);
    const newPost = new Post({
      title,
      summary,
      content,
      images,
      author: req.user.id,
    });
    await newPost.save();
    res.json({ message: "Post created successfully" });
  } catch (err) {
    console.log("Error occured while creating a post", err);
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    console.log("Error occured while fetching posts", err);
  }
};
/*
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      
  );
});
*/
export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, summary, content, images } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        images,
      },
      {
        new: true,
      }
    );
    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log("Error occured while updating the post", err);
  }
};
export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate("author", ["username"]);
    res.json(post);
  } catch (err) {
    console.log("Error at fetch single post");
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
   

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log("Error occurred while deleting the post", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const adminDeletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted by admin successfully" });
  } catch (err) {
    console.error("Admin delete error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
