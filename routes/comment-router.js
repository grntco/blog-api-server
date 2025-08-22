import Router from "express";
import {
  getAllComments,
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../controllers/comment-controller.js";
import { auth, admin } from "../middleware/auth.js";

const commentRouter = Router();

// Public:
commentRouter.get("/posts/:postId/comments", getCommentsByPost);

// Auth:
commentRouter.post("/posts/:postId/comments", auth, createComment);

// Admin:
commentRouter.get("/comments", admin, getAllComments);
commentRouter.delete("/comments/:commentId", admin, deleteComment);

export default commentRouter;
