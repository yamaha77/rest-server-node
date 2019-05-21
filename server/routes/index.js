const express = require('express');

const app = express();

app.use( require('../routes/user'));
app.use( require('../routes/login'));
app.use( require('../routes/category'));
app.use( require('../routes/product'));

module.exports = app