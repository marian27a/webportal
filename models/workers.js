var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var workerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true,
    },
    male:{
        type: String,
        require: true
    }, 
    isAdmin: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});
var Workers = mongoose.model('Worker', workerSchema);

module.exports = Workers;