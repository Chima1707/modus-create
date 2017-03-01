'use strict';

const Hapi = require('hapi');
const Boom = require('boom')
const Joi = require('joi')
const async = require('async')
const Path = require('path')
const service = require('./lib/service')
const noResult = require('./lib/config.json').noResult

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8888 
});


server.route({
    method: 'GET',
    path:'/vehicles/{modelYear}/{manufacturer}/{model}', 
    handler: handleGetVehicles.bind(null, 'params')
});

server.route({
    method: 'POST',
    path:'/vehicles', 
    handler: handleGetVehicles.bind(null, 'payload')
});



server.start((err) => {
    if (err) {
     throw err
  }
  console.log('Server running at:', server.info.uri);
});

/**
 * @param {String}  fetchFrom - where to fetch api params from. should either be params or payload
 * @param {Object} request - Request object
 * @param {Object} reply - Reply object
 */
function handleGetVehicles (fetchFrom, request, reply) {
      let year = request[fetchFrom] ? request[fetchFrom].modelYear : ''
      let manufacturer = request[fetchFrom] ? request[fetchFrom].manufacturer : ''
      let model = request[fetchFrom] ? request[fetchFrom].model : ''

      let withRating = request.query.withRating && request.query.withRating === 'true'

       service.getVehicles(withRating, year, manufacturer, model, (error, data) => {
          if (error) {
              return reply(noResult)
          }
          return reply(data)
      })
}


module.exports = server