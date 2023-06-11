import Message from "../schemas/messageSchema.js";
import mongoose from "mongoose";
import HttpStatus from "../enums/HttpStatusEnum.js";

const MessageController = {
  create: (req, res) => {
    const messageInput = req.body;
    messageInput._id = mongoose.Types.ObjectId();

    const newMessage = new Message(messageInput);
    newMessage
      .save()
      .then(() => {
        res
          .status(HttpStatus.Created)
          .send({ content: newMessage.content, success: true });
      })
      .catch((error) => {
        res.status(HttpStatus.ServerError).json({ message: error.message });
      });
  },

  delete: async (req, res) => {
    try {
      const removedMessage = await Message.deleteOne({ _id: req.params.id });
      if (!removedMessage) {
        res.status(HttpStatus.NotFound).json("Not found");
      }
      return res.status(HttpStatus.Ok).json({ message: "Message was removed" });
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      let messages = await Message.find().sort({ createdAt: "desc" });
      return res.status(HttpStatus.Ok).json(messages);
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },
};

export default MessageController;
