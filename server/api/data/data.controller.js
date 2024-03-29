'use strict';

var Data = require('./data.model');

/**
* Get Data for a device
*/
exports.index = function(req, res) {
    var number = req.params.number;
    var limit = parseInt(req.params.limit) || 30;
    Data
    .find({
        number: number
    })
    .sort({'createdAt': -1})
    .limit(limit)
    .exec(function(err, devices) {
        if (err) return res.status(500).send(err);
        res.status(200).json(devices);
    });
};

/**
* Create a new data record
*/
exports.create = function (req, res, next) {
    var data = req.body;
    data.createdBy = req.user._id;
    if (data.topic === 'led') {
        // Not required to create a data record, only to notify the device
        require('../../mqtt/index.js').sendLEDData(data.data.l); // send led value
        return res.status(200).json({});
    } else {
        Data.create(data, function (err, _data) {
            if (err) return res.status(500).send(err);
            res.json(_data);
        });
    }
};
