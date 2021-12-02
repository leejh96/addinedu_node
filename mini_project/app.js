const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);
app.use('/api/book', bookRouter);


app.use(function (err, req, res, next) {
    res.status(500).send(err);
});


app.listen(5000, () => {
    console.log('server on...');
})