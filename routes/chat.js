var express = require('express'),
    bodyParser = require('body-parser'),
    //mongoose = require('mongoose'),
    Messages = require('../models/messages'),
    Verify = require('./verify'),
    chatRouter = express.Router();


chatRouter.use(bodyParser.json());

chatRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Messages.find({}, function (err, messages) {
        if (err) throw err;
        res.json(messages);
    });
})