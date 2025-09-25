import { query, body } from "express-validator";
import prisma from "../../config/prisma-config.js";

const validateGetUsers = [
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Search term must be less than 50 characters and greater than 1."
    )
    .bail()
    .matches(/^[a-zA-Z0-9\s@.\-_,;:()'"!?&+=/#\u00C0-\u017F]+$/)
    .withMessage("Search contains invalid characters."),
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Page must be a positive integer less than 1000"),
];

const validateEditUser = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 16 })
    .withMessage("Enter a valid first name."),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 16 })
    .withMessage("Enter a valid last name."),
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .isLength({ min: 6, max: 100 })
    .withMessage("Enter a valid email address.")
    .bail()
    .custom(async (value, { req }) => {
      const userId = parseInt(req.params.userId);

      const existingUser = await prisma.user.findFirst({
        where: {
          email: value,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        throw new Error("The email provided is already taken.");
      }
      return true;
    }),
  body("admin")
    .toBoolean()
    .isBoolean()
    .withMessage("Admin must be a boolean value"),
];

export { validateGetUsers, validateEditUser };
