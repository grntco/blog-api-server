import express from "express";
import dotenv from "dotenv";
import prisma from "./config/prisma-config.js";
import postRouter from "./routes/post-router.js";

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

// app.post("/users", async (req, res, next) => {
//   const newUser = await prisma.user.create({
//     data: {
//       firstName: "Grant",
//       lastName: "Collins",
//       email: "grantcollins@gmail.com",
//       password: "password",
//       admin: true,
//     },
//   });

//   console.log(newUser);

//   res.send(newUser);
// });

app.listen(PORT, () =>
  console.log(`Server started and running on port ${PORT}!`)
);
