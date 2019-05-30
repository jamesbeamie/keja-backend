const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdHomes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Home'
        }
    ]
});

module.exports = mongoose.model('AdminUser', adminSchema);