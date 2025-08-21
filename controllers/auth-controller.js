import prisma from "../config/prisma-config.js";
import { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Unable to create user" });
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      admin: user.admin,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};

export const login = async (req, res, next) => {
  const user = req.user;

  jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
    (err, token) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Token generation error: " + err });
      }
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }
  );
};

export const logout = async (req, res, next) => {
  // rm jwt on req.user?
  // passport logout with local
};
