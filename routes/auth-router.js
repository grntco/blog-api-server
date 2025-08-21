import { Router } from "express";
import { register, login } from "../controllers/auth-controller.js";
import passport from "../config/passport-config.js";

const authRouter = Router();

// Public:
authRouter.post("/auth/register", register);
authRouter.post(
  "/auth/login",
  passport.authenticate("local", { session: false }),
  login
);

export default authRouter;
