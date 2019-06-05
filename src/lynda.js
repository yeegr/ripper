var request = require('request'),
    $ = require('jquery')(require("jsdom").jsdom().defaultView)

module.exports = function(app) {
  app.get('/lynda', function(req, res, next) {
    getEpisodeNames(res, req.query.path, req.query.dup)
  })
}

function getEpisodeNames(res, path, duplicate) {
  var url = 'https://www.lynda.com/' + path,
  	duplicate = arguments[2] || false

  request({
    followAllRedirects: true,
    url: url
  }, function (error, response, body) {
    if (!error) {
      var dom = $(body),
      list = dom.find('td.summary'),
      text = ''

      for (var i = 0, j = list.length; i < j; i++) {
        var tmp = list[i].innerHTML

        tmp = (tmp.indexOf('<sup') > -1) ? tmp.substring(0, tmp.indexOf('<sup')) : tmp,
        tmp = tmp.replace(/<\/?[^>]+(>|$)/g, "").replace(/\"\s\"/g, '-').replace(/\"|\?/g, '').replace(': ', ' - ').replace('/', ' - ')

        text += tmp + '<br/>' + ((duplicate === 'true') ? (tmp + '<br/>') : '')
      }

      res.status(200).send(text)
    }
  })
}