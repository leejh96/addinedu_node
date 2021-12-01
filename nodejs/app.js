const express = require('express');
const app = express();
const indexRouter = require('./routes');
const carRouter = require('./routes/car');

const path = require('path');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter);
app.use('/car', carRouter);

app.listen(3000, () => {
    console.log('server on...');
})