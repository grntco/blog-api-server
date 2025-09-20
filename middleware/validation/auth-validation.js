import { body } from "express-validator";
import prisma from "../../config/prisma-config.js";

const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Please enter a first name.")
    .bail()
    .isLength({ min: 2, max: 16 })
    .withMessage("A name must be between 2 and 16 characters."),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Please enter a last name.")
    .bail()
    .isLength({ min: 2, max: 16 })
    .withMessage("A name must be between 2 and 16 characters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter an email.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .bail()
    .normalizeEmail()
    .isLength({ min: 6, max: 100 })
    .withMessage("An email must be between 6 and 100 characters.")
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error("The email provided is already taken.");
      }
      return true;
    })
    .withMessage("The email provided is already taken."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter a password.")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain a minimum of 8 characters (including 1 uppercase letter, 1 number, and 1 symbol)."
    ),
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter your email.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("password").trim().notEmpty().withMessage("Please enter your password."),
];

export { validateRegister, validateLogin };
