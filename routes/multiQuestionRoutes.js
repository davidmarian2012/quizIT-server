import express from 'express';
import MultiQuestionController from '../controllers/multiQuestionController.js';

const app = express();

app.get('/', async(req, res) => {
    await MultiQuestionController.getAll(req, res);
})

app.post('/', async(req, res) => {
    MultiQuestionController.create(req, res);
})

export default app;