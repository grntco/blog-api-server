import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth-router.js";
import postRouter from "./routes/post-router.js";
import userRouter from "./routes/user-router.js";
import commentRouter from "./routes/comment-router.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("This is the API backend for The Odin Project's Blog API project.");
});

app.use(authRouter);
app.use(postRouter);
app.use(userRouter);
app.use(commentRouter);

app.listen(PORT, () =>
  console.log(`Server started and running on port ${PORT}!`)
);
