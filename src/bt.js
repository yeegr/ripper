var request = require('request'),
    $ = require('jquery')(require("jsdom").jsdom().defaultView)

module.exports = function(app) {
  app.get('/bt', function(req, res, next) {
    getMagnetLink(req.headers, req.query.keywords, res)
  })
}

function getMagnetLink(headers, keywords, res) {
  var url = 'https://rarbg.to/torrents.php?search=720p+rartv+' + keywords.replace(/\s/gi, '+')

  request({
    followAllRedirects: true,
    url: url,
    headers: {
        'Cookie': 'wQnP98Kj=wZkvrmuL',
        'User-Agent': headers['user-agent']
    }
  }, function (error, response, body) {
    if (!error) {
      var dom = $(body),
        list = dom.find('table.lista2t'),
        text = ''

        console.log(list[0])

/*
      for (var i = 0, j = list.length; i < j; i++) {
        var tmp = list[i].innerHTML
        text += tmp + '<br/>'
      }*/

      //text += list[0].innerHTML


      res.status(200).send(body)
    }
  })
}