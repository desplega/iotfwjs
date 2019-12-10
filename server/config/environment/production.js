'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://mongodb/iotfwjs-test',
    options: {
      user: 'iotfwjs-user',
      pass: 'm4ng4db'
    }
  },

  // MQTT server options
  mqtt: {
    host: 'mqtt.desplega.com',
    clientId: 'API_Server_Dev',
    port: 8883
  }
};