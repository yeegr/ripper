const async = require('async'),
	{ JSDOM } = require('jsdom'),
	fs = require('fs'),
	moment = require('moment'),
	_ = require('lodash')

var tv = [
	{
		"title":"Homeland",
		"id":"1796960",
		"season":8,
		"download":"https://rarbg.to/torrents.php?search=homeland"
	},
	{
		"title":"Brooklyn Nine-Nine",
		"id":"2467372",
		"season":7,
		"download":"https://rarbg.to/torrents.php?search=720p+brooklyn+nine-nine"
	},
	{
		"title":"Last Week Tonight",
		"id":"3530232",
		"season":7,
		"download":"https://rarbg.to/torrents.php?search=720p+last+week+tonight"
	},
	{
		"title":"Mom",
		"id":"2660806",
		"season":7,
		"download":"https://rarbg.to/torrents.php?search=720p+mom"
	},
	{
		"title":"The Orville",
		"id":"5691552",
		"season":3,
		"download":"https://rarbg.to/torrents.php?search=1080p+rartv+the+orville"
	},
	{
		"title":"Will and Grace",
		"id":"0157246",
		"season":11,
		"download":"https://rarbg.to/torrents.php?search=ion10+will+and+grace"
	},
	{
		"title":"Agents of SHIELD",
		"id":"2364582",
		"season":7,
		"download":"https://rarbg.to/torrents.php?search=rartv+1080p+agents"
	},
	{
		"title":"Harley Quinn",
		"id":"7658402",
		"season":1,
		"download":"https://rarbg.to/torrents.php?search=rartv+1080p+harley+quinn+dcu"
	},
	{
		"title":"Star Wars: The Clone Wars",
		"id":"0458290",
		"season":7,
		"download":"https://rarbg.to/torrents.php?search=rartv+1080p+star+wars+clone"
	},
	{
		"title":"Real Time with Bill Maher",
		"id":"0350448",
		"season":18,
		"download":"https://rarbg.to/torrents.php?search=720p+real+time+with+bill+maher"
	},
	{
		"title":"_Marvel Week",
		"download":"https://torrentz2.eu/search?f=marvel+week"
	},
	{
		"title":"_Windows Weekly",
		"download":"http://twit.tv/ww"
	}
]

var results = [],
	today = moment().startOf('day')

module.exports = function(app) {
  app.get('/tv', function(req, res, next) {
		
		async.eachSeries(tv, (value, callback) => {
			setTimeout(() => {
				getEpisodeDates(value, callback)
			}, 1000)			
		}, (err) => {
			if (err) console.error(err.message)
				
			let end = _(results).sortBy('title').groupBy('day').value()

			console.log(JSON.stringify(end, null, 2))
				
			fs.writeFile('./dev/shows.js', 'var shows = ' + JSON.stringify(end), {encoding: 'utf8', flag: 'w'},  (e) => {
				if (e) console.error(e.message)
				results = []
				res.status(200).send(end)
			})
		})
  })
}

function getEpisodeDates(show, callback) {
	if (show.title === '_Marvel Week') {
		results.push(Object.assign({}, show, {
			"day": 4
		}))

		callback()
	} else if (show.title === '_Windows Weekly') {
		results.push(Object.assign({}, show, {
			"day": 4
		}))

		callback()
	} else {
		const url = 'https://www.imdb.com/title/tt' + show.id + '/episodes?season=' + show.season

		console.log(url)

		JSDOM.fromURL(url, {}).then(dom => {
			const {document} = dom.window,
				wrapper = document.querySelectorAll('.eplist > div')
			
			let start,
				next,
				day

			wrapper.forEach((ep, i) => {
				let info = ep.querySelector('.info'),
					lnk = info.querySelector('strong a'),
					title = lnk.innerHTML.trim(),
					airdate = info.querySelector('.airdate'),
					str = airdate.innerHTML.trim(),
					date = moment(str, 'DD MMMM YYYY'),
					dt = date.format('YYYY-MM-DD')

				if (i === 0) {
					start = dt
					day = date.day()
				}

				if (date >= today && next === undefined) {
					next = {
						"ep": (1+i),
						dt,
						title
					}
				}
			})

			results.push(Object.assign({}, show, {
				start,
				next,
				day
			}))

			callback()
		})
	}
}
