import mongoose from "mongoose";

const numericalQuestionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
    timestamps: true,
  }
);

const NumericalQuestion = mongoose.model(
  "NumericalQuestion",
  numericalQuestionSchema
);

export default NumericalQuestion;
