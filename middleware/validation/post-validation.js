import { body, query } from "express-validator";
import prisma from "../../config/prisma-config.js";

const validateGetPosts = [
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
  query("published")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
];

const validateCreatePost = [
  body("title")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .withMessage("Please enter a valid post title."),
  body("content")
    .trim()
    .notEmpty()
    .isLength({ min: 10, max: 30000 })
    .withMessage("Please enter valid post content."),
  // body("slug")
  //   .optional()
  //   .trim()
  //   .notEmpty()
  //   .isLength({ min: 2, max: 100 })
  //   .matches(/^[a-zA-Z0-9\s-]+$/)
  //   .withMessage("Enter a valid slug.")
  //   .bail()
  //   .custom(async (value) => {
  //     const existingSlug = await prisma.post.findUnique({
  //       where: {
  //         slug: value,
  //       },
  //     });

  //     if (existingSlug) {
  //       throw new Error("The slug provided is already taken.");
  //     }
  //     return true;
  //   }),
  body("published")
    .toBoolean()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
];

const validateEditPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please enter a post title.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Please enter a valid post title."),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Please enter post content.")
    .bail()
    .isLength({ min: 10, max: 30000 })
    .withMessage("Please enter valid post content."),
  body("slug")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("Enter a valid slug.")
    .bail()
    .custom(async (value, { req }) => {
      const postId = parseInt(req.params.postId);

      const existingSlug = await prisma.post.findFirst({
        where: {
          slug: value,
          NOT: { id: postId },
        },
      });

      if (existingSlug) {
        throw new Error("The slug provided is already taken.");
      }
      return true;
    }),
  body("published")
    .toBoolean()
    .isBoolean()
    .withMessage("Admin must be a boolean value"),
];

export { validateGetPosts, validateCreatePost, validateEditPost };
