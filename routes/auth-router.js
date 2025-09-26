import { Router } from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation/auth-validation.js";
import { register, login } from "../controllers/auth-controller.js";

const authRouter = Router();

// Public:
authRouter.post("/auth/register", validateRegister, register);
authRouter.post("/auth/login", validateLogin, login);
authRouter.post("/auth/admin/login", validateLogin, login);

export default authRouter;
