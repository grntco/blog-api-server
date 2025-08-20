import { Router } from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUser,
} from "../controllers/user-controller.js";

const userRouter = Router();

// should probably be protected too

// GETs
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:userId", getUser);

// POSTs

userRouter.post("/users", createUser);
userRouter.patch("/users/:userId", editUser);
userRouter.delete("/users/:userId", deleteUser);

export default userRouter;
