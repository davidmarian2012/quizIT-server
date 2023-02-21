import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        author: {
            type: String,
            required: true
        },
        content: {
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

const Message = mongoose.model('Message', messageSchema);

export default Message