const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN });
        res.json({
            ok: true,
            user: user_db,
            token
        })
    })
});

// Google Configs
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        name: payload.name,
        mail: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    
    let token = req.body.idtoken;
    let google_user = await verify(token)
        .catch((err) => {
            res.status(403).json({
                ok: false,
                err
            });
        });

    User.findOne( { mail: google_user.mail }, (err, user_db) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( user_db ) {
            if ( user_db.google === false ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Use normal authentication by user and password'
                    }
                });
            } else {
                
                let token = jwt.sign({
                    user: user_db
                }, process.env.SEED, {expiresIn: process.env.EXPIRED_TOKEN });
                return res.json({
                    ok: true,
                    user: user_db,
                    token
                });
            }
        } else {
            // User not found on database
            let user = new User();

            user.name = google_user.name;
            user.mail = google_user.mail;
            user.img = google_user.img;
            user.google = true;
            user.password = ':)';

            user.save( (err, user_db) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: user_db
                }, process.env.SEED, {expiresIn: process.env.EXPIRED_TOKEN });
                return res.json({
                    ok: true,
                    user: user_db,
                    token
                });
            })
        }
    });
});

module.exports = app;