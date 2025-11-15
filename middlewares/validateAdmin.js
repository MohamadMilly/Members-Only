const { body } = require("express-validator");

require("dotenv").config();

const passcodeEmptyMessage = "Passcode shouldn't be empty.";
const mismatchError = "Passcode is incorrect.";

const validateAdmin = [
  body("adminPasscode")
    .trim()
    .notEmpty()
    .withMessage(passcodeEmptyMessage)
    .custom((value, { req }) => {
      const adminPasscode = process.env.ADMIN_PASSCODE;
      const match = adminPasscode === value;
      if (!match) {
        throw new Error(mismatchError);
      } else {
        return true;
      }
    }),
];

module.exports = validateAdmin;
