'use strict';

var test   = require('tape');
var server = require('./../server'); 

test('GET /vehicles/2015/Audi/A3 (get vehicles decriptions when called with existing modelYear, manufacturer, and model)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2015/Audi/A3'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 4, 'vehicle count should be 4' );
    t.notEqual(response.result.Results[0].VehicleId, undefined, 'VehicleId exist for vehicles' );
    t.end();
  });
});

test('GET /vehicles/2013/Ford/Crown Victoria (get vehicles decriptions when called with none existing modelYear, manufacturer, and model)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2013/Ford/Crown Victoria'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 0, 'vehicle count should be 0' );
    t.end();
  });
});

test('GET /vehicles/undefined/Ford/Fusion (get vehicles decriptions when called with incorrect parameters)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2013/Ford/Crown Victoria'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 0, 'vehicle count should be 0' );
    t.end();
  });
});

test('POST /vehicles (get vehicles decriptions when called with correct payload as parameters instead)', function(t) {
  var options = {
    method: 'POST',
    url: '/vehicles',
    payload: {
      "modelYear": 2015,
      "manufacturer": "Audi",
      "model": "A3"
    }
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 4, 'vehicle count should be 4' );
    t.notEqual(response.result.Results[0].VehicleId, undefined, 'VehicleId exist for vehicles' );
    t.end();
  });
})

test('POST /vehicles (get vehicles decriptions when called with correct payload as parameters instead)', function(t) {
  var options = {
    method: 'POST',
    url: '/vehicles',
    payload: {
    "manufacturer": "Honda",
    "model": "Accord"
   }
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 0, 'vehicle count should be 0' );
    t.end();
  });
})

test('GET /vehicles/2015/Audi/A3?withRating=true (get vehicles decriptions and rating when called with existing modelYear, manufacturer, model, withRating=true)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2015/Audi/A3?withRating=true'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 4, 'vehicle count should be 4' );
    t.notEqual(response.result.Results[0].VehicleId, undefined, 'VehicleId exist for vehicles' );
    t.notEqual(response.result.Results[0].CrashRating, undefined, 'CrashRating exist for vehicles' );
    t.end();
  });
});

test('GET /vehicles/2015/Audi/A3?withRating=false (get vehicles decriptions and rating when called with existing modelYear, manufacturer, model, withRating=false)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2015/Audi/A3?withRating=false'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 4, 'vehicle count should be 4' );
    t.notEqual(response.result.Results[0].VehicleId, undefined, 'VehicleId exist for vehicles' );
    t.equal(response.result.Results[0].CrashRating, undefined, 'CrashRating does not exist for vehicles' );
    t.end();
  });
});

test('GET /vehicles/2015/Audi/A3?withRating=bananas (get vehicles decriptions and rating when called with existing modelYear, manufacturer, model, withRating=bananas)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2015/Audi/A3?withRating=bananas'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 4, 'vehicle count should be 4');
    t.notEqual(response.result.Results[0].VehicleId, undefined, 'VehicleId exist for vehicles' );
    t.equal(response.result.Results[0].CrashRating, undefined, 'CrashRating does not exist for vehicles' );
    t.end();
  });
});

test('GET /vehicles/2013/Ford/Crown Victoria?withRating=true (get vehicles decriptions and rating when called with none existing modelYear, manufacturer, model, withRating=true)', function(t) {
  var options = {
    method: 'GET',
    url: '/vehicles/2013/Ford/Crown Victoria?withRating=true'
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, 'Successful');
    t.equal(response.result.Count, 0, 'vehicle count should be 0' );
    t.end();
  });
});


test.onFinish(function () {
  server.stop(function(){});
})