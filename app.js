import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth-router.js";
import postRouter from "./routes/post-router.js";
import userRouter from "./routes/user-router.js";
import commentRouter from "./routes/comment-router.js";
import { handleGeneralErrors } from "./middleware/general-errors.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("This is the API backend for The Odin Project's Blog API project.");
});

app.use(authRouter);
app.use(postRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(handleGeneralErrors);

app.listen(PORT, () =>
  console.log(`Server started and running on port ${PORT}!`)
);
