var request = require('request'),
	fs = require('fs'),
	async = require('async'),
	moment = require('moment'),
	_ = require('lodash'),
  $ = require('jquery')(require("jsdom").jsdom().defaultView)

var mv = [
	{
		"title": "Terminator: Dark Fate",
		"id": "6450804"
	},
	{
		"title": "Frozen II",
		"id": "4520988"
	},
	{
		"title": "Star Wars IX",
		"id": "2527338"
	},
	{
		"title": "The Voyage of Doctor Dolittle",
		"id": "6673612"
	},
	{
		"title": "Godzilla vs. Kong",
		"id": "5034838"
	},
	{
		"title": "Mulan",
		"id": "4566758"
	},
	{
		"title": "Bond 25",
		"id": "2382320"
	},
	{
		"title": "Onward",
		"id": "7146812"
	},
	{
		"title": "Black Widow",
		"id": "3480822"
	},
	{
		"title": "Wonder Woman 1984",
		"id": "7126948"
	},
	{
		"title": "Ghostbusters 2020",
		"id": "4513678"
	},
	{
		"title": "Top Gun: Maverick",
		"id": "1745960"
	},
	{
		"title": "Monster Hunter",
		"id": "6475714"
	},
	{
		"title": "Eternals",
		"id": "9032400"
	},
	{
		"title": "Shang-Chi and the Legend of the Ten Rings",
		"id": "9376612"
	},
	{
		"title": "Doctor Strange in the Multiverse of Madness",
		"id": "9419884"
	},
	{
		"title": "Thor: Love and Thunder",
		"id": "10648342"
	},
	{
		"title": "Dune",
		"id": "1160419"
	},
	{
		"title": "Avatar 2",
		"id": "1630029"
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