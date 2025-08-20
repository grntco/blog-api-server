import express from "express";
import dotenv from "dotenv";
import prisma from "./config/prisma-config.js";
import postRouter from "./routes/post-router.js";
import userRouter from "./routes/user-router.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.use(postRouter);
app.use(userRouter);

app.listen(PORT, () =>
  console.log(`Server started and running on port ${PORT}!`)
);
