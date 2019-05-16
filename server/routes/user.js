const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const app = express();

const { verificationToken, verificationRole } = require('../middlewares/authentication');

app.get('/user', verificationToken,(req, res) => {
    
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 5;
    User.find({ state: true }, 'name mail img state google role')
        .skip(since)
        .limit(limit)
        .exec( (err, users) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            } 

            User.count({ state: true }, (err, quantity) => {
                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                } 
                res.json({
                    ok: true,
                    users,
                    count: quantity
                });
            })
        })
});
  
app.post('/user', [verificationToken, verificationRole],(req, res) => {
    
    let body = req.body;
    let user = new User({
        name: body.name,
        mail: body.mail,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save( (err, user_db) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        } 

        res.json({
            ok: true,
            user: user_db
        }); 
    });
});

app.put('/user/:id', [verificationToken, verificationRole],(req, res) => {
    
    let body = _.pick(req.body, ['name', 'mail', 'role', 'state']);
    let id = req.params.id;
    User.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true }, 
        (err, user_db) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } 
            res.json({
                ok: true,
                user_db
            });
        });

    
});

app.delete('/user/:id', [verificationToken, verificationRole],(req, res) => {
    
    let id = req.params.id;
    let new_state = { state: false };
    User.findByIdAndUpdate(id, new_state,
        { new: true },
        (err, user_remove) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } 
            if (!user_remove) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'User not found'
                    }
                });
            }
            res.json({
                ok: true,
                user_remove
            });
        })
});

module.exports = app;