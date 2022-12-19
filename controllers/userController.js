import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HttpStatus from "../enums/HttpStatusEnum.js";

const UserController = {
    create: (req, res) => {
        const userInput = req.body;
        userInput._id = mongoose.Types.ObjectId();

        const newUser = new User(userInput);
        newUser.save().then(() => {
            res.status(HttpStatus.Created).send({username: newUser.username ,success: true})
        })
        .catch(error=>{
            res.status(HttpStatus.ServerError).json({message: error.message});
        })
    },

    login: async (req, res) => {
        try{
            let user = await User.findOne({username: req.body.username});
            if (!user) return res.status(HttpStatus.NotFound).send('Invalid username/password');

            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(HttpStatus.NotFound).send('Invalid username/password');

            return res.status(HttpStatus.Ok).send('Login was successfull');
        }
        catch(error){
            res.status(HttpStatus.ServerError).json({message: error.message});
        }
    }
}

export default UserController;