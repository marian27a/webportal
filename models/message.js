var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    authorName: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true,
    },
},{
    timestamps: true
});
var Messages = mongoose.model('Message', MessageSchema);

module.exports = Messages;