import Router from "express";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../controllers/comment-controller.js";

const commentRouter = Router();

// GETs

commentRouter.get("/posts/:postId/comments", getCommentsByPost);

// POSTs
commentRouter.post("/posts/:postId/comments", createComment);

// PUTs/PATCHes
// DELETEs
commentRouter.delete("/posts/:postId/comments/:commentId", deleteComment);

export default commentRouter;
