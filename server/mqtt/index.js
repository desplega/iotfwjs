var Data = require('../api/data/data.model');
var mqtt = require('mqtt');
var config = require('../config/environment');

var client = mqtt.connect({
    port: config.mqtt.port,
    protocol: 'mqtts',
    host: config.mqtt.host,
    clientId: config.mqtt.clientId,
    reconnectPeriod: 1000,
    username: config.mqtt.clientId,
    password: config.mqtt.clientId,
    keepalive: 300,
    rejectUnauthorized: false
});

client.on('connect', function () {
    console.log('Connected to Mosquitto at ' + config.mqtt.host + ' on port ' + config.mqtt.port);
    client.subscribe('api-engine');
    client.subscribe('dht11');
});

client.on('message', function (topic, message) {
    if (topic === 'api-engine') {
        var number = message.toString();
        console.log('Device number >> ', number);
        client.publish('rpi', 'Got device number: ' + number);
    } else if (topic === 'dht11') {
        try {
            var data = JSON.parse(message.toString());
            // Pending to add a json scheme validator!
            // create a new data record for the device
            console.log('Message received from: ', data.number);
            Data.create(data, function (err, data) {
                if (err) return console.error(err);
                // if the record has been saved successfully,
                // websockets will trigger a message to the web-app
                console.log('Data Saved :', data.data);
            });
        } catch (e) {
            console.log('Incorrect message. Discarded...');
        }
    } else {
        console.log('Unknown topic', topic);
    }
});

exports.sendLEDData = function (data) {
    console.log('Sending Data', data);
    client.publish('led', data);
}
