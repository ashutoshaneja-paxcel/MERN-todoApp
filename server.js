const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todo');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION ,{ useNewUrlParser: true, useUnifiedTopology: true },
    () => {console.log('Connected to DB..')}
);

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/todo', todoRoute);


app.listen(3000, ()=> console.log('Server up and running!'));