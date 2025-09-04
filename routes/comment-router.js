import Router from "express";
import {
  validateGetComments,
  validateCreateComment,
} from "../middleware/validation/comment-validation.js";
import {
  getComments,
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../controllers/comment-controller.js";
import { auth, admin } from "../middleware/auth.js";

const commentRouter = Router();

// Public:
commentRouter.get("/posts/:postId/comments", getCommentsByPost);

// Auth:
commentRouter.post(
  "/posts/:postId/comments",
  auth,
  validateCreateComment,
  createComment
);

// Admin:
commentRouter.get("/comments", admin, validateGetComments, getComments);
commentRouter.delete("/comments/:commentId", admin, deleteComment);

export default commentRouter;
