const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const app = express(); 

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'Files upload not found'
        });
    }

    let typeValide = ['products', 'users'];
    if (typeValide.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: `You not type selected. Type validate are ${typeValide.join(', ')}`
            }
        });
    }

    let file = req.files.file;
    let nameFile = file.name.split('.');
    let extension = nameFile[ nameFile.length - 1 ];

    let extensionsValidate = ['png', 'jpg', 'gif', 'jpeg'];
    if ( extensionsValidate.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            msg: `Allowed extension validate are ${extensionsValidate.join(', ')}`,
            ext: extension
        })
    }

    let newNameFile = `${ id }-${ new Date().getMinutes() }-${ new Date().getMilliseconds() }.${ extension }`;
    file.mv(`uploads/${ type }/${ newNameFile }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if ( type === 'users' ) imgUser(id, res, newNameFile);
        if ( type === 'products' ) imgProduct(id, res, newNameFile);
        
      });

});

function imgUser(id, res, nameFile) {

    User.findById(id, (err, user_db) => {

        if (err) {
            deleteFile( nameFile, 'users' );
            return res.status(500).json({
                ok: false,
                err
            });
        }  
        if ( !user_db )
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'User not found'
                }
            });

        deleteFile( user_db.img, 'users' );
        user_db.img = nameFile;
        user_db.save( (err, user_save) => {

            if ( err )
                return res.status(500).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                user: user_save,
                img: nameFile
            });
        });
        
    });
}

function imgProduct(id, res, nameFile) {

    Product.findById( id, (err, product_db) => {

        if ( err ) {
            deleteFile( nameFile, 'products' );
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !product_db ) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: 'Product not found'
                }
            });
        }

        deleteFile( product_db.img, 'products' );
        product_db.img = nameFile;
        product_db.save( (err, product_save) => {
            
            if ( err ) 
                return res.status(500).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                product: product_save,
                img: nameFile
            });
        });
    });
}

function deleteFile(name, type) {

    let pathImg = path.resolve(__dirname,`../../uploads/${ type }/${ name }`);
    if ( fs.existsSync(pathImg) ) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;