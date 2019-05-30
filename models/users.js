const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName : {
        type: String,
        required: true
    },
    userLocation : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: Number,
        required: true
    },
});