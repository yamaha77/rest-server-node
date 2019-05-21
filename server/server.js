require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// PUBLIC 
app.use( express.static( path.resolve(__dirname, '../public') ) );

// Config mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ROUTES
app.use( require('./routes/index') );

// DATABASE
mongoose.connect(process.env.URL_DB, (err, res) => {
    if (err) throw err;
    console.log('DB active');
});

// SERVER
app.listen(process.env.PORT, () => {
  console.log('Server RUN...!');
});