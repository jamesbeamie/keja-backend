const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const homeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true 
    },
    homeType: {
        type: String,
        required: true
    },
    size : {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'AdminUser'
    }
});

module.exports =  mongoose.model('Home', homeSchema);