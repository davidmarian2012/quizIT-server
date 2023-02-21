import Message from "../schemas/messageSchema.js";
import mongoose from "mongoose";
import HttpStatus from "../enums/HttpStatusEnum.js";
import MessageSchema from "../schemas/messageSchema.js";

const MessageController = {
    create: (req, res) => {
        const messageInput = req.body;
        messageInput._id = mongoose.Types.ObjectId();

        const newMessage = new Message(messageInput);
        newMessage.save().then(() => {
            res.status(HttpStatus.Created).send({content: newMessage.content ,success: true})
        })
        .catch(error=>{
            res.status(HttpStatus.ServerError).json({message: error.message});
        })
    },

    getAll: async (req, res) => {
        try{
            let messages = await MessageSchema.find();
            res.status(HttpStatus.Ok).json({messages: messages});
        } catch (error){
            res.status(HttpStatus.ServerError).json({message: error.message});
        }
    }
}

export default MessageController;