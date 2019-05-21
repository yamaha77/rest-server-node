const express = require('express');
const _ = require('underscore');
const Category = require('../models/category');

let { verificationToken, verificationRole } = require('../middlewares/authentication');

const app = express();

app.get('/category', verificationToken, (req, res) => {

    Category.find({})
            .sort('description')
            .populate('user', 'name mail')
            .exec( (err, categories) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categories
                });
            });
});

app.get('/category/:id', verificationToken, (req, res) => {

    let id = req.params.id;
    Category.findById( id, (err, category_db) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !category_db) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Category with id not found'
                }
            });
        }
        res.json({
            ok: true,
            category: category_db
        });
    });

});

app.post('/category', verificationToken, (req, res) => {

    let description = req.body.description;
    let category = new Category({
        description,
        user: req.user._id
    });

    category.save( (err, category_db) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!category_db) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category_db
        });
    });
});

app.put('/category/:id', verificationToken, (req, res) => {

    let body = _.pick(req.body, ['description']);
    let id = req.params.id;
    let category = {
        description: body.description
    }
    Category.findByIdAndUpdate( id, category,
        { new: true, runValidators: true, context: 'query' },
        (err, category_db) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!category_db) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: category_db
        });
    });
});

app.delete('/category/:id', [verificationToken, verificationRole], (req, res) => {

    let id = req.params.id;
    Category.findByIdAndDelete( id, (err, category_db) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category_db
        });
    });
});

module.exports = app;