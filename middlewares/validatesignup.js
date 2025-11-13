const { body } = require("express-validator");
const db = require("../db/queries");

const emptyError = "should not be empty.";
const isAlphaError = "should only contain letters.";
const lengthError = "should be between 3 and 25 characters.";
const strongPasswordError =
  "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
const alreadyTakenError = "This username is already taken.";

const validateSignUp = [
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage(`Firstname ${emptyError}`)
    .isAlpha()
    .withMessage(`Firstname ${isAlphaError}`)
    .isLength({ min: 3, max: 25 })
    .withMessage(`Firstname ${lengthError}`),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage(`Lastname ${emptyError}`)
    .isAlpha()
    .withMessage(`Lastname ${isAlphaError}`)
    .isLength({ min: 3, max: 25 })
    .withMessage(`Lastname ${lengthError}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyError}`)
    .isLength({ min: 3, max: 25 })
    .withMessage(`Username ${lengthError}`)
    .custom(async (value, { req }) => {
      const user = await db.getUser(value);
      if (user) {
        throw new Error(alreadyTakenError);
      } else {
        return true;
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyError}`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(strongPasswordError),
  body("confirm_password").custom(async (value, { req }) => {
    const passwordConfirmation = value;
    const password = req.body.password;
    if (passwordConfirmation !== password) {
      throw new Error("Password confirmation does not match password");
    } else {
      return true;
    }
  }),
];

module.exports = validateSignUp;
