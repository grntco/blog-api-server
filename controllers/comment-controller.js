import prisma from "../config/prisma-config.js";

// necessary?
export const getAllComments = async (req, res, next) => {};

export const getCommentsByPost = async (req, res, next) => {
  //
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

// Necessary?
export const getComment = async (req, res, next) => {};

// TODO: signed up users only
export const createComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = 1;
    // TODO: need user id from current user, not from params, although it will be in params i suppose with passport
    const { content } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const comment = await prisma.comment.create({
      data: {
        // TODO: change author id to userId
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

// Admin only
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
