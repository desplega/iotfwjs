'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/iotfwjs'
  },

  // MQTT server options
  mqtt: {
    host: 'mqtt.desplega.com',
    clientId: 'API_Server_Dev',
    port: 8883
  }
};