import mongoose from "mongoose";

const multiQuestionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        question: {
            type: String,
            required: true
        },
        answers: {
            type: Array,
            required: true
        },
        correct: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: false},
        timestamps: true
    }
)

const MultiQuestion = mongoose.model('MultiQuestion', multiQuestionSchema);

export default MultiQuestion