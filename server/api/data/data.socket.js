/**
* Broadcast updates to client when the model changes
*/

'use strict';

var data = require('./data.model');
var socket = undefined;

exports.register = function (_socket) {
    socket = _socket;
}

function onSave(doc) {
    // Ensure client is connected
	if (socket) {
        // Sending to all clients except sender
        socket.broadcast.emit('data:save:' + doc.number, doc);
        // Sending to the client
        socket.emit('data:save:' + doc.number, doc);
    }
}

module.exports.onSave = onSave;