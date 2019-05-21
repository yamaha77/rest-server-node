const express = require('express');
const _ = require('underscore');
const Product = require('../models/product');

let { verificationToken, verificationRole } = require('../middlewares/authentication');

const app = express();

app.get('/product', verificationToken,(req, res) => {

    let body = _.pick(req.body, ['limit', 'slice']);
    let limit = Number(body.limit) || 10;
    let since = Number(body.since) || 0;

    Product.find({})
           .sort('name')
           .limit(limit)
           .skip(since)
           .populate('user', 'name mail')
           .populate('category', 'description')
           .exec( (err, products) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } 
                res.json({
                    ok: true,
                    products
                });
           });
});

app.get('/product/:id', verificationToken, (req, res) => {

    let id = req.params.id;
    Product.findById( id )
            .sort('name')
            .populate('user', 'name mail')
            .populate('category', 'description')
            .exec( (err, product_db) => {

                if (err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } 
                if ( !product_db ){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            msg: 'Product with id not found'
                        }
                    })
                } 
                res.json({
                    ok: true,
                    product: product_db
                });
            });
});

app.get('/product/search/:term', verificationToken, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    Product.find({ name: regex })
            .populate('category', 'description')
            .exec( (err, products) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } 
                if ( !products ){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            msg: 'Products not found'
                        }
                    })
                } 
                res.json({
                    ok: true,
                    products
                });
            });
});

app.post('/product', verificationToken,(req, res) => {

    let user_id = req.user._id;
    let body = _.pick(req.body, ['name', 'unit_price', 'availabled', 'category','description']);
    let product = new Product({
        name: body.name,
        unit_price: body.unit_price,
        description: body.description,
        availabled: body.availabled,
        category: body.category,
        user: user_id
    });
    product.save( (err, product_db) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        } 
        res.status(201).json({
            ok: true,
            product: product_db
        });
    });
});

app.put('/product/:id', verificationToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'unit_price', 'availabled', 'category','description']);

    Product.findById( id, (err, product_db) => {

        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 
        if ( !product_db ){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: `Product with id ${id} not found`
                }
            })
        } 

        product_db.name = body.name;
        product_db.unit_price = body.unit_price;
        product_db.availabled = body.availabled;
        product_db.category = body.category;
        product_db.description = body.description;

        product_db.save( (err, product_new) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            } 
            res.json({
                ok: true,
                product: product_new
            });
        });
    });
});

app.delete('/product/:id', [verificationToken, verificationRole], (req, res) => {

    let id = req.params.id;
    let availabled_new = { availabled: false };
    Product.findByIdAndUpdate( id, availabled_new, 
        { new: true, runValidators: true, context: 'query' },
        (err, product_db) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if ( !product_db ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Product not found'
                    }
                });
            }
            product_db.availabled = availabled_new;
            res.json({
                ok: true,
                product_db
            });
    });
});

module.exports = app;