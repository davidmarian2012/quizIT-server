import express from "express";
import MessageController from "../controllers/messageController.js";

const app = express();

app.get("/", async (req, res) => {
  await MessageController.getAll(req, res);
});

app.post("/", async (req, res) => {
  MessageController.create(req, res);
});

app.delete("/:id", async (req, res) => {
  await MessageController.delete(req, res);
});

export default app;
