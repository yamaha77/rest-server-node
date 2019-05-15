require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Config mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use( require('./routes/user') );

mongoose.connect(process.env.URL_DB, (err, res) => {
    if (err) throw err;

    console.log('DB active');
});

app.listen(process.env.PORT, () => {
  console.log('Example app listening on port 3000!');
});