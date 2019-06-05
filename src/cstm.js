var request = require('request'),
    $ = require('jquery')(require("jsdom").jsdom().defaultView)

module.exports = function(app) {
  app.get('/cstm', function(req, res, next) {
    var url = 'http://cstm.cdstm.cn/e/action/ListInfo/?classid=91'

    request({
      followAllRedirects: true,
      url: url
    }, function (error, response, body) {
      if (!error) {
        var dom = $(body),
        list = dom.find('.hdyg').next().find('li'),
        text = `<table>
  <thead>
    <tr>
      <th>日期</th><th>时间</th><th>活动</th>
  </tr>
  </thead>
  <tbody>`

        for (var i = 0, j = list.length; i < j; i++) {
          var tmp = $(list[i]),
            a = $(tmp.find('a')),
            lnk = 'http://cstm.cdstm.cn' + a.attr('href'),
            txt = a.text().trim(),
            dt = tmp.find('.hdyg-time').text().trim()
//            month = parseInt(dt.substring(0, dt.indexOf('月'))) - 1,
//            date = parseInt(dt.substring(dt.indexOf('月') + 1, dt.indexOf('日')))

          dt = dt.replace(/：/g, ':').replace(/—/g, '-').replace(/（/g, '').replace(/\(/g, '').replace(/）/g, ')').replace(/上午/g, '')
          
          var date = dt.substring(0, dt.indexOf(')')),
            time = dt.substring(dt.indexOf(')') + 1)

          if (txt.substring(0,8) === '【中科馆大讲堂】') {
            var title = txt.substring(9)

            text += '\n\t\t<tr>\n\t\t\t<td>' + date + '</td><td>' + time + '</td><td><a href="' + lnk + '" target="cstm">' + title + '</a></td>\n\t\t</tr>'
          }
        }

        res.status(200).send(text + '\n\t</tbody>\n</table>')
      }
    })

  })
}
