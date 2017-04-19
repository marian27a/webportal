var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String
        
    },
    password: {
        type: String,
        required: false
    },
    userSurname: {
        type: String,
        required: false
    },
    male:{
        type: String,
        require: false
    }, 
    isAdmin: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});



User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);