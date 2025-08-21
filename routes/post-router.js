import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} from "../controllers/post-controller.js";
import { admin } from "../middleware/auth.js";

const postRouter = Router();

// Public:
postRouter.get("/posts", getAllPosts);
postRouter.get("/posts/:postId", getPost);

// Admin:
postRouter.post("/posts", admin, createPost);
postRouter.patch("/posts/:postId", admin, editPost);
postRouter.delete("/posts/:postId", admin, deletePost);

export default postRouter;
