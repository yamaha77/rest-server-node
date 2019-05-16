const express = require('express');

const app = express();

app.use( require('../routes/user'));
app.use( require('../routes/login'));

module.exports = app