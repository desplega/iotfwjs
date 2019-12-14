'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/iotfwjs-test',
    options: {
      user: 'iotfwjs-user',
      pass: 'm4ng4db'
    }
  },

  // MQTT server options
  mqtt: {
    host: 'mqtt.desplega.com',
    clientId: 'API_Server_Live',
    port: 8883
  }
};