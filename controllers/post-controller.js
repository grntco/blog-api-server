import prisma from "../config/prisma-config.js";

// TODO: add server logs

// GETS
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();

    if (posts.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }

    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// filtered or search

// POSTS
export const createPost = async (req, res, next) => {
  // TODO: temp, make sure to switch for req.user.id, and newPost for req.data
  const userId = 1;
  const { title, content, slug, published } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
        published: published === "true" || published === true,
      },
    });

    if (!post) {
      return res.status(400).json({ error: "Unable to create post" });
    }

    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// PUTs/PATCHes

// TODO: must be authorized
export const editPost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  try {
    const { title, content, slug, published } = req.body;

    if (isNaN(postId)) {
      console.error("Error: Invalid post id");
      return res.status(400).json({ error: "Invalid post id" });
    }

    // TODO: validate this a different way with express-validator
    if (!data || Object.keys(data).length === 0) {
      console.error("Error: No form data received");
      return res.status(400).json({ error: "No form data received" });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        slug,
        published: published === "true" || published === true,
      },
    });

    res.json(post);
  } catch (err) {
    console.error(`Error: Unable to update post with id ${postId}`);
    res.status(400).json({ error: err.message });
  }
};

// Maybe... editPostStatus (just updates status)

// DELETE

// TODO: must be authorized
export const deletePost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);

  try {
    if (isNaN(postId)) {
      console.error("Error: Invalid post id");
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await prisma.post.delete({ where: { id: postId } });

    res.json(post);
  } catch (err) {
    console.error(`Error: Unable to delete post with id ${postId}`);
    res.status(400).json({ error: err.message });
  }
};
