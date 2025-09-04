import { Router } from "express";
import { admin } from "../middleware/auth.js";
import {
  validateGetUsers,
  validateEditUser,
} from "../middleware/validation/user-validation.js";
import {
  deleteUser,
  editUser,
  getUsers,
  getUser,
} from "../controllers/user-controller.js";

const userRouter = Router();

// Admin:
userRouter.get("/users", admin, validateGetUsers, getUsers);
userRouter.get("/users/:userId", admin, getUser);
userRouter.patch("/users/:userId", admin, validateEditUser, editUser);
userRouter.delete("/users/:userId", admin, deleteUser);

export default userRouter;
