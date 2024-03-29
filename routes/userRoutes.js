import express from "express";
import UserController from "../controllers/userController.js";
import userValidator from "../validators/userValidator.js";
import validate from "../validators/validator.js";
import path from "path";
import multer from "multer";

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "avatar/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    req.fileValidationError = "Only images allowed";
    return cb(new Error("Only images allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 3000000 },
});

app.post("/upload", upload.single("avatar"), async (req, res) => {
  await UserController.upload(req, res);
});

app.post("/removeAvatar", async (req, res) => {
  await UserController.removeAvatar(req, res);
});

app.post("/update", async (req, res) => {
  await UserController.updatePoints(req, res);
});

app.get("/", async (req, res) => {
  await UserController.getAll(req, res);
});

app.get("/usersbypoints", async (req, res) => {
  await UserController.getAllByPoints(req, res);
});

app.post("/", userValidator.registerRequest(), validate, async (req, res) => {
  UserController.create(req, res);
});

app.post("/login", userValidator.loginRequest(), validate, async (req, res) => {
  await UserController.login(req, res);
});

app.post("/username", async (req, res) => {
  await UserController.getUserByUsername(req, res);
});

app.post("/resetpassword", async (req, res) => {
  await UserController.resetPassword(req, res);
});

app.get("/:activationToken", async (req, res) => {
  await UserController.activate(req, res);
});

app.post("/forgot-password", async (req, res) => {
  await UserController.forgotPassword(req, res);
});

app.post("/reset-password/:resetToken", async (req, res) => {
  await UserController.resetPasswordToken(req, res);
});

app.get("/reset-password/:resetToken", async (req, res) => {
  await UserController.showResetPasswordForm(req, res);
});

export default app;
