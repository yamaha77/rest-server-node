const express = require('express');
const User = require('../models/user');

const app = express();

app.get('/user', (req, res) => {
    res.json('GET user local');
  });
  
  app.post('/user', (req, res) => {
      
        let body = req.body;
        let user = new User({
            name: body.name,
            mail: body.mail,
            password: body.password,
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
  
  app.put('/user/:id', (req, res) => {
      
      let id = req.params.id;
      res.json({
          id
      });
  });
  
  app.delete('/user', (req, res) => {
      res.json('DELETE user');
  });

module.exports = app;