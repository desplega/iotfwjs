'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://mongodb/iotfwjs'
    },

    mqtt: {
        //host: process.env.EMQTT_HOST || '127.0.0.1',
	host: 'mqtt.desplega.com',
        clientId: 'API_Server_Dev',
        port: 8883
    }
};
