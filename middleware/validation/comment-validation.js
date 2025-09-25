import { body, query } from "express-validator";

const validateGetComments = [
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

const validateCreateComment = [
  body("content")
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 1000 })
    .withMessage("Please enter a valid comment."),
];

export { validateGetComments, validateCreateComment };
