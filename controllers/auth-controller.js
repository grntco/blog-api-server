import prisma from "../config/prisma-config.js";
import { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { matchedData, validationResult } from "express-validator";
import passport from "../config/passport-config.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const data = matchedData(req);

    const { firstName, lastName, email, password } = data;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
        formData: {
          firstName,
          lastName,
          email,
        },
      });
    }

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
      return res.status(400).json({
        success: false,
        message: "Unable to create user.",
        errors: ["Unable to create user."],
        formData: {
          firstName,
          lastName,
          email,
        },
      });
    }

    res.json({
      success: true,
      message: "Account successfully created.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
      errors: [err.message],
      formData: {
        firstName,
        lastName,
        email,
      },
    });
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
      formData: {
        email: req.body.email,
      },
    });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({
        success: false,
        message: "Unable to login. Please try again later.",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Unable to login. Please try again later.",
        formData: {
          email: req.body.email,
        },
      });
    }

    jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (jwtErr, token) => {
        if (jwtErr) {
          console.error("Token generation error:", jwtErr);
          return res.status(500).json({
            success: false,
            message: "Error generating authentication token.",
          });
        }

        res.json({
          success: true,
          message: "Login successful.",
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
  })(req, res, next);
};
