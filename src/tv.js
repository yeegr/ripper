const async = require('async'),
	{ JSDOM } = require('jsdom'),
	fs = require('fs'),
	moment = require('moment'),
	_ = require('lodash')

const rarbg = 'https://rarbg.to/torrents.php?search='

var tv = [
	{
		"title":"Harley Quinn",
		"id":"7658402",
		"season":3,
		"delay":24,
		"download":rarbg+"rartv+1080p+harley+quinn+dcu"
	},
	{
		"title":"Big Hero 6: The Series",
		"id":"5515212",
		"season":3,
		"delay":24,
		"download":rarbg+"rartv+1080p+big+hero+6"
	},
	{
		"title":"Primal",
		"id":"10332508",
		"season":2,
		"delay":24,
		"download":rarbg+"rartv+1080p+primal"
	},
	{
		"title":"His Dark Material",
		"id":"5607976",
		"season":3,
		"delay":24,
		"download":rarbg+"1080p+amzn+his+dark+material"
	},
	{
		"title":"Brooklyn Nine-Nine",
		"id":"2467372",
		"season":8,
		"delay":24,
		"download":rarbg+"ion10+brooklyn+nine-nine"
	},
	{
		"title":"Last Week Tonight",
		"id":"3530232",
		"season":8,
		"delay":24,
		"download":rarbg+"720p+last+week+tonight"
	},
	{
		"title":"Mom",
		"id":"2660806",
		"season":8,
		"delay":24,
		"download":rarbg+"ion10+mom"
	},
	{
		"title":"Star Trek: Picard",
		"id":"8806524",
		"season":2,
		"delay":12,
		"download":rarbg+"1080p+rartv+star+trek+picard"
	},
	{
		"title":"The Orville",
		"id":"5691552",
		"season":3,
		"delay":24,
		"download":rarbg+"1080p+rartv+the+orville"
	},
	{
		"title":"Zoey's Extraordinary Playlist",
		"id":"10314462",
		"season":2,
		"delay":24,
		"download":rarbg+"ion10+zoey+extraordinary+playlist"
	},
	{
		"title":"Real Time with Bill Maher",
		"id":"0350448",
		"season":19,
		"delay":24,
		"download":rarbg+"720p+real+time+with+bill+maher"
	},
	{
		"title":"Doom Patrol",
		"id":"8416494",
		"season":3,
		"delay":24,
		"download":rarbg+"1080p+doom+patrol"
	},
	{
		"title":"Star Trek: Lower Decks",
		"id":"9184820",
		"season":2,
		"delay":12,
		"download":rarbg+"1080p+star+trek+lower+decks+cbs"
	},
	{
		"title":"The Mandalorian",
		"id":"8111088",
		"season":3,
		"delay":12,
		"download":rarbg+"1080p+rartv+mandalorian"
	},
	{
		"title":"WondaVision",
		"id":"9140560",
		"season":1,
		"delay":12,
		"download":rarbg+"1080p+rartv+dsny+wandavision"
	},
	{
		"title":"The Boys",
		"id":"1190634",
		"season":3,
		"delay":12,
		"download":rarbg+"1080p+the+boys"
	},
	{
		"title":"Disney Gallery: The Mandalorian",
		"id":"12162902",
		"season":2,
		"delay":24,
		"download":rarbg+"1080p+disney+gallery+star+wars+mandalorian"
	},
	{
		"title":"Marvel Week",
		"link":"https://getcomics.info/tag/marvel-now/"
	},
	{
		"title":"Windows Weekly",
		"link":"http://twit.tv/ww"
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
	if (show.title === 'Marvel Week') {
		results.push(Object.assign({}, show, {
			"day": 4
		}))

		callback()
	} else if (show.title === 'Windows Weekly') {
		results.push(Object.assign({}, show, {
			"day": 4
		}))

		callback()
	} else {
		const url = 'https://www.imdb.com/title/tt' + show.id + '/episodes?season=' + show.season

		console.log(url + ' | ' + show.title)

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
					date = (str.length > 4) ? moment(str, 'DD MMMM YYYY').add(show.delay, 'hours') : null,
					dt = date ? date.format('YYYY-MM-DD') : null

				if (i === 0 && date) {
					start = dt
					day = date.day()
				}

				if (date && date.diff(today) > 0 && next === undefined) {
					next = {
						"ep": (1+i),
						dt,
						title
					}

					day = date.day()
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
