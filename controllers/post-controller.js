import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";
import createSlug from "../utils/create-slug.js";
import { matchedData, validationResult } from "express-validator";

export const getPosts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { search, published, page } = matchedData(req);

    console.log(published);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: errors.array(),
      });
    }

    const pageTake = 6;
    const currentPage = parseInt(page) || 1;
    const pageSkip = (currentPage - 1) * pageTake;

    const searchWhere = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(published !== undefined && { published }),
    };

    const [posts, totalPostsFound, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: searchWhere,
        skip: pageSkip,
        take: pageTake,
        include: {
          author: { select: userWithoutPassword },
        },
        orderBy: [{ createdAt: "desc" }],
      }),
      prisma.post.count({ where: searchWhere }),
      prisma.post.count(),
    ]);

    res.json({
      success: true,
      message: "Successfully retrieved posts.",
      posts,
      meta: {
        totalPostsFound,
        totalPosts,
        currentPage,
        totalPages: Math.ceil(totalPostsFound / pageTake),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts. Please try again later.",
    });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
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
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve post. Please try again later.",
    });
  }
};

export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { title, content, slug, published } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const userId = parseInt(req.user.id);
    const formattedSlug = slug ? createSlug(slug) : createSlug(title);
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: formattedSlug,
        published: published === "true" || published === true,
      },
    });

    if (!post) {
      console.error("Unable to create post");
      return res
        .status(400)
        .json({ success: false, message: "Unable to create post" });
    }

    res.json({ success: true, message: "Successfully created post.", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to create post. Please try again later.",
    });
  }
};

export const editPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { title, content, slug, published } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        slug,
        published: published === "true" || published === true,
      },
      include: {
        author: {
          select: userWithoutPassword,
        },
      },
    });

    res.json({ success: true, message: "Successfully edited post.", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to edit post. Please try again later.",
    });
  }
};

export const deletePost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);

  try {
    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await prisma.post.delete({ where: { id: postId } });

    res.json({ message: `Successfully deleted the post "${post.title}".` });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to delete post. Please try again later.",
    });
  }
};
