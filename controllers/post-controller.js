import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: userWithoutPassword },
      },
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: userWithoutPassword },
        comments: {
          include: {
            author: { select: userWithoutPassword },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, slug, published } = req.body;
    const userId = req.user.id;

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
      console.error("Unable to create post");
      return res.status(400).json({ error: "Unable to create post" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const editPost = async (req, res, next) => {
  try {
    const { title, content, slug, published } = req.body;
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        slug,
        published: published === "true" || published === true,
      },
      inlcude: {
        author: {
          select: userWithoutPassword,
        },
      },
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);

  try {
    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.delete({ where: { id: postId } });

    res.json({ message: `Successfully deleted the post "${post.title}".` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
