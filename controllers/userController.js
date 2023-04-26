import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import HttpStatus from "../enums/HttpStatusEnum.js";
import jsonwebtoken from 'jsonwebtoken';
import logger from '../services/logger.js';

const UserController = {
    create: (req, res) => {
        const userInput = req.body;
        userInput._id = mongoose.Types.ObjectId();
        userInput.points = 0;

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
            if (!user) return res.status(HttpStatus.Unauthorized).send('Invalid username/password');

            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(HttpStatus.Unauthorized).send('Invalid username/password');

            let response = {
                id: user._id,
                username: user.username,
            }

            const jwtKey = process.env.JWT_SECRET_KEY || 'secret_key'
            const token = jsonwebtoken.sign(
                {user: response},
                jwtKey,
                {algorithm: 'HS256'}
            )

            return res.status(HttpStatus.Ok).json({token: token})
        }
        catch(error){
            logger.error(error.message);
            res.status(HttpStatus.ServerError).json({message: error.message});
        }
    },

    getAll: async (req, res) => {
        try{
            let users = await User.find();
            return res.status(HttpStatus.Ok).json(users);
        } catch (error){
            res.status(HttpStatus.ServerError).json({message: error.message});
        }
    },

    getUserByUsername: async (req, res) => {
        try{
            let user = await User.findOne({
                username: req.body.username
            });

            if(user){
                res.status(HttpStatus.Ok).json(user);
            }
            res.status(HttpStatus.Ok).json();
        } catch (error){
            logger.error(error.message);
            res.status(HttpStatus.ServerError).json({message: error.message});
        }
    }
}

export default UserController;