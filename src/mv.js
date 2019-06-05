var request = require('request'),
	fs = require('fs'),
	async = require('async'),
	moment = require('moment'),
	_ = require('lodash'),
  $ = require('jquery')(require("jsdom").jsdom().defaultView)

var mv = [
	{
		"title": "Shazam!",
		"id": "0448115"
	},
	{
		"title": "X-Men: Dark Phoenix",
		"id": "6565702"
	},
	{
		"title": "Chaos Walking",
		"id": "2076822"
	},
	{
		"title": "Dumbo",
		"id": "3861390"
	},
	{
		"title": "The Voyage of Doctor Dolittle",
		"id": "6673612"
	},
	{
		"title": "Avengers 4",
		"id": "4154796"
	},
	{
		"title": "John Wick 3",
		"id": "6146586"
	},
	{
		"title": "Aladdin",
		"id": "6139732"
	},
	// {
	// 	"title": "Minecraft",
	// 	"id": "3566834"
	// },
	{
		"title": "Toy Story 4",
		"id": "1979376"
	},
	{
		"title": "Spider-Man Homecoming 2",
		"id": "6320628"
	},
	{
		"title": "The Lion King",
		"id": "6105098"
	},
	{
		"title": "The New Mutants",
		"id": "4682266"
	},
	{
		"title": "Bond 25",
		"id": "2382320"
	},
	{
		"title": "Wonder Woman 2",
		"id": "7126948"
	},
	{
		"title": "Terminator 6",
		"id": "6450804"
	},
	{
		"title": "Frozen 2",
		"id": "4520988"
	},
	{
		"title": "Star Wars IX",
		"id": "2527338"
	},
	{
		"title": "Mulan",
		"id": "4566758"
	},
	{
		"title": "Top Gun 2",
		"id": "1745960"
	}
]

var results = [],
	today = moment().startOf('day')

module.exports = function(app) {
  app.get('/mv', function(req, res, next) {
		
		async.eachSeries(mv, (value, callback) => {
			setTimeout(() => {
				checkMovies(value, callback)
			}, 1000)			
		}, (err) => {
			if (err) console.error(err.message)
							
			let end = _(results).sortBy('date').value()
				
			fs.writeFile('./dev/movies.js', 'var movies = ' + JSON.stringify(end), {encoding: 'utf8', flag: 'w'},  (e) => {
				if (e) console.error(e.message)
				results = []
				res.status(200).send(end)
			})
		})
  })
}

function checkMovies(movie, callback) {
		var url = 'https://www.imdb.com/title/tt' + movie.id
		
		// console.log('movie: ' + movie.title + ' | ' + url)
		
	  request({
	    followAllRedirects: true,
	    url: url
	  }, function (error, response, body) {
	    if (!error) {
	      var dom = $(body),
					block = dom.find('.title_wrapper'),
					title = block.find('h1').text().replace(/\(\d{4}\)/, '').trim(),
					txt = block.find('.subtext a:last').text(),
				  tmp = txt.substring(0, txt.indexOf('(')).trim(),
					dt = moment(tmp),
				  date = dt.format('YYYY-MM-DD')
				
				
				if (dt > today) {
					results.push(Object.assign({}, movie, {
						title,
						date
					}))
				}
				
				console.log(title + ' : ' + date)

				callback()
	    } else {
				console.log(movie.title + '[ ' + url + ' ] : '  + error)
	    }
	  })
}

function removeDuplicates(arr) {
	let tmp = [arr[0]]
	
	for (var i = 1, j = arr.length; i < j; i++) {
		if (arr[i].dt !== arr[i-1].dt) {
			tmp.push(arr[i])
		}
	}
	
	return tmp
}