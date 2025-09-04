import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";
import { validationResult, matchedData } from "express-validator";

export const getComments = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { search, page } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: errors.array(),
      });
    }

    const pageTake = 12;
    const currentPage = parseInt(page) || 1;
    const pageSkip = (currentPage - 1) * pageTake;

    const searchWhere = search
      ? { content: { contains: search, mode: "insensitive" } }
      : {};

    const [comments, totalCommentsFound, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where: searchWhere,
        skip: pageSkip,
        take: pageTake,
        include: { author: { select: userWithoutPassword } },
        orderBy: [{ createdAt: "desc" }, { content: "asc" }],
      }),
      prisma.comment.count({ where: searchWhere }),
      prisma.comment.count(),
    ]);

    res.json({
      success: true,
      message: "Successfully retrieved comments.",
      comments,
      meta: {
        totalCommentsFound,
        totalComments,
        currentPage,
        totalPages: Math.ceil(totalCommentsFound / pageTake),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve comments. Please try again later.",
    });
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: userWithoutPassword } },
    });

    res.json({
      success: true,
      message: "Successfully retrieved post comments.",
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve post comments. Please try again later.",
    });
  }
};

export const createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const { content } = matchedData(req);
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        content,
      },
    });

    res.json({
      success: true,
      message: "Comment successfully created.",
      comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to create comment. Please try again later.",
    });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      console.error("Error: Invalid comment ID");
      return res
        .status(400)
        .json({ success: true, message: "Invalid comment ID" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.json({ success: true, message: "Successfully deleted comment." });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to delete comment. Please try again later.",
    });
  }
};
