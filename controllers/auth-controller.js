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
      console.error("Error: Unable to create user");
      return res.status(400).json({ error: "Unable to create user" });
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      admin: user.admin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
        console.error("Error: Token generation error: ", err);
        return res.status(400).json({ error: "Token generation error: ", err });
      }
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          admin: user.admin,
        },
      });
    }
  );
};
