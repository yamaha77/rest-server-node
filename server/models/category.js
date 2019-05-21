const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'Description is required']
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

categorySchema.plugin( uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model( 'category', categorySchema );