'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
    number: {
        type: String
    },
    data: {
        type: Schema.Types.Mixed
    },
    createdBy: {
        type: String,
        default: 'LoRa Radio Node'
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

DataSchema.pre('save', function (next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

DataSchema.post('save', function (doc) {
    //console.log('Post Save Called', doc);
    require('./data.socket.js').onSave(doc)
});

module.exports = mongoose.model('Data', DataSchema);