const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] 
    },
    unit_price: { 
        type: Number, 
        required: [true, 'Price is required'] 
    },
    description: { 
        type: String, 
        required: false 
    },
    img: { 
        type: String, 
        required: false 
    },
    availabled: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'category', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'user' 
    }
});


module.exports = mongoose.model('product', productSchema);