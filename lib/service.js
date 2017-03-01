'use strict';

const async = require('async')
const baseAPIUrl = require('./config.json').nhsta
const request = require('request')
const noResult = require('./config.json').noResult

module.exports = {
    getVehicles: getVehicles,

}

/**
 * @param {Boolean} withRating - fetch Vehicle with rating
 * @param {String} year - Vehicle year
 * @param {String} manufacturer - Vehicle manufacturer
 * @param {String} model - Vehicle model
 * @callback callback - Callback to call
 */
function getVehicles (withRating, year, manufacturer, model, callback) {
 !withRating ? fetchVehicles(year, manufacturer, model, callback) : fetchVehiclesWithRating(year, manufacturer, model, callback)
}

/**
 * @param {String} year - Vehicle year
 * @param {String} manufacturer - Vehicle manufacturer
 * @param {String} model - Vehicle model
 * @callback callback - Callback to call
 */
function fetchVehicles (year, manufacturer, model, callback) {
 let path = `/modelyear/${year}/make/${manufacturer}/model/${model}?format=json`
 let api = `${baseAPIUrl}${path}`
 request({ url: api, json: true }, handleResponse.bind(null, callback, formatGetVehiclesResult))
}

/**
 * @param {String} year - Vehicle year
 * @param {String} manufacturer - Vehicle manufacturer
 * @param {String} model - Vehicle model
 * @callback callback - Callback to call
 */
function fetchVehiclesWithRating (year, manufacturer, model, callback) {
  fetchVehicles(year, manufacturer, model, (error, res) => {
      if (error) {
          return callback(error)
      }
    async.each(res.Results, function (vehicle, callback) {
         getVehicleRating(vehicle.VehicleId, (err, result) => {
              if (err) {
                  return callback(err)
              }
              if (result.Results && result.Results.length) {
                 vehicle.CrashRating =  result.Results[0].OverallRating
              }
           callback()
          })
      }, (err) => {
       if(err) {
       return callback(err)
       }
       return callback(null, res)
      }
  )
 
})
}

/**
 * @param {Number}  vehicleId- VehicleId
 * @callback callback - Callback to call
 */
function getVehicleRating (vehicleId, callback) {
 let path = `/VehicleId/${vehicleId}?format=json`
 let api = `${baseAPIUrl}${path}`
 request({ url: api, json: true }, handleResponse.bind(null, callback, null))
}

/**
 * @param {Number}  data- fetch vehicle results
 * @returns {Object} formated data
 */
function formatGetVehiclesResult (data) {
    let res = Object.assign({}, noResult)
    if (data) {
       if (data.Count) {
           res.Count = data.Count
       }
       if (data.Results && data.Results.length) {
           res.Results = data.Results.map((item) => {
               return {Description: item.VehicleDescription, VehicleId: item.VehicleId}
           })
       }
    }
    return res;
}


/**
 * @callback callback - Callback to call
 * @param {Function} format - A format function for each item in the Result field of body
 * @param {Object} error - Error Object if available
 * @param {Object} response - Raw response object
 * @param {Object} body - JSON response from the api
 */
function handleResponse (callback, format,  error, response, body) {
    if (error) {
      return callback(error)
    } else if (response.statusCode === 200) {
        if (format && typeof format === "function") {
            body = format(body)
        }
      return callback(null, body)
    } else {
      callback({
        error: true,
        statusCode: response.statusCode,
        message: body
      })
    }
  }
