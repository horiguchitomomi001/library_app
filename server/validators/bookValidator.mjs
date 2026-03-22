import { body } from "express-validator";

export const createBookValidator = [
  body("title")
    .trim()
    .isString().withMessage("Title must be a string")
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),

  body("author")
    .trim()
    .isString().withMessage("Author must be a string")
    .notEmpty().withMessage("Author is required")
    .isLength({ max: 255 }).withMessage("Author must be less than 255 characters")
];