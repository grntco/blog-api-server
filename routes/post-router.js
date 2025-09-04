import { Router } from "express";
import {
  validateGetPosts,
  validateCreatePost,
  validateEditPost,
} from "../middleware/validation/post-validation.js";
import {
  getPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} from "../controllers/post-controller.js";
import { admin } from "../middleware/auth.js";

const postRouter = Router();

// Public:
postRouter.get("/posts", validateGetPosts, getPosts);
postRouter.get("/posts/:postId", getPost);

// Admin:
postRouter.post("/posts", admin, validateCreatePost, createPost);
postRouter.patch("/posts/:postId", admin, validateEditPost, editPost);
postRouter.delete("/posts/:postId", admin, deletePost);

export default postRouter;