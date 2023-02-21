import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Database } from './dbConnection.js';

import UserRoutes from './routes/userRoutes.js';
import MessageRoutes from './routes/messageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));


const db = new Database();
db.connect(); 

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use('/user', UserRoutes);
app.use('/message', MessageRoutes)

const port = 8080;
app.listen(port, () => console.log(`Backend application listening at http://localhost:${port}`));