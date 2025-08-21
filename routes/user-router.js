import { Router } from "express";
import {
  deleteUser,
  editUser,
  getAllUsers,
  getUser,
} from "../controllers/user-controller.js";
import { admin } from "../middleware/auth.js";

const userRouter = Router();

// Admin:
userRouter.get("/users", admin, getAllUsers);
userRouter.get("/users/:userId", admin, getUser);
userRouter.patch("/users/:userId", admin, editUser);
userRouter.delete("/users/:userId", admin, deleteUser);

export default userRouter;
