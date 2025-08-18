import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} from "../controllers/post-controller.js";

const postRouter = Router();

// GETs
postRouter.get("/posts", getAllPosts);
postRouter.get("/posts/:postId", getPost);

// POSTs
postRouter.post("/posts", createPost);

// PUTs
postRouter.put("/posts/:postId", editPost);

// DELETEs
postRouter.delete("/posts/:postId", deletePost);

export default postRouter;
