const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/user', (req, res) => {
  res.json('GET user');
});

app.post('/user', (req, res) => {
    
    let body = req.body;
    if ( body.name === undefined ){
        res.status(400).json({
            ok: false,
            msg: 'Name requerid'
        })
    } else {
        res.json({
            body
        });
    }
    
});

app.put('/user/:id', (req, res) => {
    
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/user', (req, res) => {
    res.json('DELETE user');
})

app.listen(process.env.PORT, () => {
  console.log('Example app listening on port 3000!');
});