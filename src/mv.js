const async = require('async'),
	{ JSDOM } = require('jsdom'),
	fs = require('fs'),
	moment = require('moment'),
	_ = require('lodash')

var mv = [
	{
		"title": "Free Guy",
		"id": "6264654"
	},
	{
		"title": "A Quiet Place 2",
		"id": "8332922"
	},
	{
		"title": "The King's Men",
		"id": "6856242"
	},
	{
		"title": "Bond 25",
		"id": "2382320"
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
		"title": "Ghostbusters: Afterlife",
		"id": "4513678"
	},
	{
		"title": "Godzilla vs. Kong",
		"id": "5034838"
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
	},
	{
		"title": "Spider-Man 3",
		"id": "10872600"
	},
	{
		"title": "Captain Marvel 2",
		"id": "10676048"
	},
	{
		"title": "Black Panther 2",
		"id": "9114286"
	},
	{
		"title": "Morbius",
		"id": "5108870"
	},
	{
		"title": "MI7",
		"id": "9603212"
	},
	{
		"title": "Matrix 4",
		"id": "10838180"
	},
	{
		"title": "Venom 2",
		"id": "7097896"
	},
	{
		"title": "The Batman",
		"id": "1877830"
	},
	{
		"title": "The Hitman's Wife's Bodyguard",
		"id": "8385148"
	},
	{
		"title": "John Wick 4",
		"id": "10366206"
	},
	{
		"title": "Guardians of the Galaxy Vol. 3",
		"id": "6791350"
	},
	{
		"title": "The Suicide Squad",
		"id": "6334354"
	},
	{
		"title": "Nobody",
		"id": "7888964"
	},
	{
		"title": "Uncharted",
		"id": "1464335"
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
	}
)}

function checkMovies(movie, callback) {
	const url = 'https://www.imdb.com/title/tt' + movie.id

	console.log(url)
	
	JSDOM.fromURL(url, {}).then(dom => {
		const {document} = dom.window

		let wrapper = document.querySelector('.title_wrapper'),
			h1 = wrapper.querySelector('h1').innerHTML,
			title = h1.substring(0, h1.indexOf('&nbsp;')).trim(),
			lnk = wrapper.querySelector('.subtext a:last-child').innerHTML,
			str = lnk.substring(0, lnk.indexOf('(')).trim(),
			dt = moment(str, 'DD MMMM YYYY'),
			date = dt.format('YYYY-MM-DD')

		if (dt > today) {
			results.push(Object.assign({}, movie, {
				title,
				date
			}))
		}

		console.log(title + ' | ' + date)

		callback()
	})
}
