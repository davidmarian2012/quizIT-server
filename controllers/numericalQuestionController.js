import NumericalQuestion from "../schemas/numericalQuestionSchema.js";
import mongoose from "mongoose";
import HttpStatus from "../enums/HttpStatusEnum.js";

const NumericalQuestionController = {
  create: (req, res) => {
    const receivedInput = req.body;
    receivedInput._id = mongoose.Types.ObjectId();

    const newQuestion = new NumericalQuestion(receivedInput);
    newQuestion
      .save()
      .then(() => {
        res
          .status(HttpStatus.Created)
          .send({ content: newQuestion.content, success: true });
      })
      .catch((error) => {
        res.status(HttpStatus.ServerError).json({ message: error.message });
      });
  },

  getAll: async (req, res) => {
    try {
      let questions = await NumericalQuestion.find();
      return res.status(HttpStatus.Ok).json(questions);
    } catch (error) {
      res.status(HttpStatus.ServerError).json({ message: error.message });
    }
  },
};

export default NumericalQuestionController;
