var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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
var Users = mongoose.model('User', userSchema);

module.exports = Users;