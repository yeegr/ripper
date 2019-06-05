var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback) {

}

var grabber = function () {

}

module.exports = function(app) {
  app.get('/grapper', function(req, res, next) {
    grabber()
  })
}