import { Router } from "express";
import {
  validateGetPosts,
  validateCreatePost,
  validateEditPost,
} from "../middleware/validation/post-validation.js";
import {
  getPublishedPosts,
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} from "../controllers/post-controller.js";
import { admin } from "../middleware/auth.js";

const postRouter = Router();

// Public:
postRouter.get("/posts/published", validateGetPosts, getPublishedPosts);
postRouter.get("/posts/:postId", getPost);

// Admin:
postRouter.get("/posts", admin, validateGetPosts, getAllPosts);
postRouter.post("/posts", admin, validateCreatePost, createPost);
postRouter.patch("/posts/:postId", admin, validateEditPost, editPost);
postRouter.delete("/posts/:postId", admin, deletePost);

export default postRouter;
