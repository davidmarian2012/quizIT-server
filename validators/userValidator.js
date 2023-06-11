import UserSchema from "../schemas/userSchema.js";
import { check } from "express-validator";

const userValidator = {
  loginRequest: () => {
    return [
      check("username")
        .exists()
        .withMessage("Username required")
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty")
        .escape(),
      check("password")
        .exists()
        .withMessage("Password required")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .escape(),
    ];
  },

  registerRequest: () => {
    return [
      check("username")
        .custom(async (username) => {
          await UserSchema.findOne({ username: username }).then((user) => {
            if (user != null) return Promise.reject();
          });
        })
        .withMessage("Username already taken"),
      check("email")
        .custom(async (email) => {
          await UserSchema.findOne({ email: email }).then((user) => {
            if (user != null) return Promise.reject();
          });
        })
        .withMessage("Email already taken"),
    ];
  },
};

export default userValidator;
