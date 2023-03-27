import express from 'express';
import UserController from '../controllers/userController.js';
import userValidator from '../validators/userValidator.js';
import validate from '../validators/validator.js';

const app = express();

app.get('/', async(req, res) => {
    res.send('GET route for User');
})

app.post('/',  userValidator.registerRequest(), validate, async(req, res) => {
    UserController.create(req, res);
})

app.post('/login',  userValidator.loginRequest(), validate, async(req, res) => {
    await UserController.login(req, res);
})

export default app;