import { Router } from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation/auth-validation.js";
import { loginLimiter, registerLimiter } from "../middleware/rate-limiter.js";
import { register, login } from "../controllers/auth-controller.js";

const authRouter = Router();

// Public:
authRouter.post("/auth/register", registerLimiter, validateRegister, register);
authRouter.post("/auth/login", loginLimiter, validateLogin, login);
authRouter.post("/auth/admin/login", loginLimiter, validateLogin, login);

export default authRouter;
