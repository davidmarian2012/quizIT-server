import express from 'express';
import UserController from '../controllers/userController.js';

const app = express();

app.get('/', async(req, res) => {
    res.send('GET route for User');
})

app.post('/', async(req, res) => {
    UserController.create(req, res);
})

app.post('/login', async(req, res) => {
    await UserController.login(req, res);
})

export default app;