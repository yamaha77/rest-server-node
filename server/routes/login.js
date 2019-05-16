const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    
    let body = req.body;
    User.findOne({ mail: body.mail }, (err, user_db) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!user_db) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'User or password no valid'
                }
            });
        }
        if ( !bcrypt.compareSync( body.password, user_db.password ) ) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'User or password no valid'
                }
            });
        }

        let token = jwt.sign({
            user: user_db
        }, 'secret-dev-api', { expiresIn: process.env.EXPIRED_TOKEN });
        res.json({
            ok: true,
            user: user_db,
            token
        })
    })
})


module.exports = app;