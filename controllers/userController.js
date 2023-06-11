import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HttpStatus from "../enums/HttpStatusEnum.js";
import jsonwebtoken from "jsonwebtoken";
import logger from "../services/logger.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "quizit2023_3@hotmail.com",
    pass: "quizit123",
  },
});

const UserController = {
  create: (req, res) => {
    const userInput = req.body;
    userInput._id = mongoose.Types.ObjectId();
    userInput.points = 0;

    const activationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User(userInput);
    newUser.isActive = false;
    newUser.activationToken = activationToken;
    newUser
      .save()
      .then(() => {
        const activationLink = `http://localhost:8080/user/${activationToken}`;

        const mailOptions = {
          from: "quizit2023_3@hotmail.com",
          to: newUser.email,
          subject: "QUIZIT Account Confirmation",
          text: `<p>Thank you for signing up. To activate your account, click the following link:</p>
          <a href="${activationLink}">${activationLink}</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email ", error);
          } else {
            console.log("Email sent ", info.response);
          }
        });
        res
          .status(HttpStatus.Created)
          .send({ username: newUser.username, success: true });
      })
      .catch((error) => {
        res.status(HttpStatus.ServerError).json({ message: error.message });
      });
  },

  activate: async (req, res) => {
    try {
      const activationToken = req.params.activationToken;
      const user = await User.findOne({
        activationToken: activationToken,
      });

      if (!user) {
        return res.status(HttpStatus.Unauthorized).send("Invalid token");
      }

      user.isActive = true;
      user.activationToken = null;
      await user.save();

      return res
        .status(HttpStatus.Ok)
        .json({ message: "User activated successfully" });
    } catch {
      (error) => {
        res.status(HttpStatus.ServerError).json({ message: error.message });
      };
    }
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({ username: req.body.username });
      if (!user)
        return res
          .status(HttpStatus.Unauthorized)
          .send("Invalid username/password");

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass)
        return res
          .status(HttpStatus.Unauthorized)
          .send("Invalid username/password");

      if (!user.isActive)
        return res.status(HttpStatus.Unauthorized).send("User not confirmed");

      let response = {
        id: user._id,
        username: user.username,
      };

      const jwtKey = process.env.JWT_SECRET_KEY || "secret_key";
      const token = jsonwebtoken.sign({ user: response }, jwtKey, {
        algorithm: "HS256",
      });

      return res.status(HttpStatus.Ok).json({ token: token });
    } catch (error) {
      logger.error(error.message);
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      let user_ = await User.findOne({ username: req.body.username });
      if (!user_)
        return res.status(HttpStatus.Unauthorized).send("Invalid username");

      const validPass = await bcrypt.compare(
        req.body.oldpassword,
        user_.password
      );
      if (!validPass) {
        return res.status(HttpStatus.Unauthorized).send("Invalid password");
      }

      user_.password = req.body.newpassword;
      await user_.save();
      return res.status(HttpStatus.Ok).send("Password changed successfully");
    } catch (error) {
      logger.error(error.message);
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      let users = await User.find();
      return res.status(HttpStatus.Ok).json(users);
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  getAllByPoints: async (req, res) => {
    try {
      let users = await User.find().sort({ points: "desc" });
      return res.status(HttpStatus.Ok).json(users);
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  getUserByUsername: async (req, res) => {
    try {
      let user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        res.status(HttpStatus.Ok).json(user);
      }
      res.status(HttpStatus.Ok).json();
    } catch (error) {
      logger.error(error.message);
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  upload: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        user.avatar = req.file.filename;
        await user.save();
        res
          .status(HttpStatus.Ok)
          .json({ message: "Avatar uploaded successfully!" });
      }
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  removeAvatar: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        user.avatar = "avatar.png";
        await user.save();
        res
          .status(HttpStatus.Ok)
          .json({ message: "Avatar removed successfully!" });
      }
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  updatePoints: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        user.points += req.body.earnedPoints;
        await user.save();
        res
          .status(HttpStatus.Ok)
          .json({ message: "Points updated successfully!" });
      }
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },
};

export default UserController;
