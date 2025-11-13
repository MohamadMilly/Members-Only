const { body } = require("express-validator");

const postTitleEmptyError = "Post title should not be empty";
const postContentEmptyError = "Post content should not be empty";
const titleLengthError = "post title shouldn't be more than 70 characters";

const validateNewPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(postTitleEmptyError)
    .isLength({ max: 70 })
    .withMessage(titleLengthError),
  body("content").trim().notEmpty().withMessage(postContentEmptyError),
  body("isAnonymous").optional(),
];

module.exports = validateNewPost;
