import prisma from "../config/prisma-config.js";

// TODO: is this necessary? for admins perhaps
export const getAllComments = async (req, res, next) => {};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};

export const createComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;
    const { content } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user id" });
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
    res.status(400).json({ error: err });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const comment = await prisma.comment.delete({ where: { id: commentId } });

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};
