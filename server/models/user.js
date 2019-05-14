const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} not role valid'
}
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    }, 
    mail: {
        type: String,
        unique: true,
        required: [true, 'Mail is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

userSchema.plugin( uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model( 'user', userSchema );
