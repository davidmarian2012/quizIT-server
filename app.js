import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Database } from './dbConnection.js';
import User from './schemas/userSchema.js';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const db = new Database();
db.connect();

app.get('/hello', (req, res) => {
    res.send('test');
})

app.post('/register', (req, res) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        email: 'test2',
        username: 'test2',
        password: 'test'
    });
    user.save().then(()=>{
        res.send({message: `Added user ${user.username}`})
        console.log(`Added user ${user.username}`)
        res.end();
    }).catch((error)=>{
        console.log(error);
    })
})

const port = 8080;
app.listen(port, () => console.log(`Backend application listening at http://localhost:${port}`));