const async = require('async'),
	{ JSDOM } = require('jsdom'),
	fs = require('fs'),
	moment = require('moment'),
	_ = require('lodash')

var binge = [
	// {
	// 	"title":"Space Force",
	// 	"id":"9612516",
	// 	"season":1,
	// 	"delay":1,
	// 	"download":"https://rarbg.to/torrents.php?search=ion10+space+force"
	// },
	{
		"title":"Wizards",
		"id":"7736558",
		"season":1,
		"delay":1,
		"download":"https://rarbg.to/torrents.php?search=1080p+wizards"
	},
	{
		"title":"Tiny Creatures",
		"id":"12759334",
		"season":1,
		"delay":1,
		"download":"https://rarbg.to/torrents.php?search=1080p+tiny+creatures"
	},
	{
		"title":"The Umbrella Academy",
		"id":"1312171",
		"season":2,
		"delay":1,
		"download":"https://rarbg.to/torrents.php?search=1080p+umbrella+academy"
	}
]

var results = [],
	today = moment().startOf('day')

module.exports = function(app) {
  app.get('/binge', function(req, res, next) {
		
		async.eachSeries(binge, (value, callback) => {
			setTimeout(() => {
				getEpisodeDates(value, callback)
			}, 1000)			
		}, (err) => {
			if (err) console.error(err.message)
				
			let end = _(results).sortBy('date')

			console.log(JSON.stringify(end, null, 2))
				
			fs.writeFile('./dev/binge.js', 'var binge = ' + JSON.stringify(end), {encoding: 'utf8', flag: 'w'},  (e) => {
				if (e) console.error(e.message)
				results = []
				res.status(200).send(end)
			})
		})
  })
}

function getEpisodeDates(show, callback) {
  const url = 'https://www.imdb.com/title/tt' + show.id + '/episodes?season=' + show.season

  console.log(url + ' | ' + show.title)

  JSDOM.fromURL(url, {}).then(dom => {
    const {document} = dom.window,
      ep = document.querySelectorAll('.eplist > div')[0]
    
    let info = ep.querySelector('.info'),
      lnk = info.querySelector('strong a'),
      title = lnk.innerHTML.trim(),
      airdate = info.querySelector('.airdate'),
      str = airdate.innerHTML.trim(),
      dt = (str.length > 4) ? moment(str, 'DD MMMM YYYY').add(show.delay, 'days') : null,
      date = dt ? dt.format('YYYY-MM-DD') : null

    results.push(Object.assign({}, show, {
      date
    }))

    callback()
  })
}
