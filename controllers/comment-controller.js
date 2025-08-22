import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";

// TODO: is this necessary? for admins perhaps
export const getAllComments = async (req, res, next) => {};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: userWithoutPassword } },
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    if (isNaN(postId)) {
      console.error("Error: Invalid post ID");
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        content,
      },
    });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      console.error("Error: Invalid comment ID");
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await prisma.comment.delete({ where: { id: commentId } });

    res.json({ message: "Successfully deleted comment." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
