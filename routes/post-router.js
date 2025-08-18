import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
} from "../controllers/post-controller.js";

const postRouter = Router();

// GETs
postRouter.get("/posts", getAllPosts);
postRouter.get("/posts/:postId", getPost);

// POSTs
postRouter.post("/posts", createPost);

// PUTs

// DELETEs

export default postRouter;
