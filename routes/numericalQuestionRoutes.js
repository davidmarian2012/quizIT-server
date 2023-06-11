import express from "express";
import NumericalQuestionController from "../controllers/numericalQuestionController.js";

const app = express();

app.get("/", async (req, res) => {
  await NumericalQuestionController.getAll(req, res);
});

app.post("/", async (req, res) => {
  NumericalQuestionController.create(req, res);
});

export default app;
