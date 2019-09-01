var request = require('request'),
	fs = require('fs'),
	async = require('async'),
	moment = require('moment'),
	_ = require('lodash'),
  $ = require('jquery')(require("jsdom").jsdom().defaultView)

var tv = [
	{
		"title":"Homeland",
		"path":"List_of_Homeland_episodes",
		"anchor":"Home_video_releases",
		"downloads":[
			"https://rarbg.to/torrents.php?search=homeland+720p"
		]
	},
	{
		"title":"Brooklyn Nine-Nine",
		"path":"List_of_Brooklyn_Nine-Nine_episodes",
		"anchor":"Ratings",
		"downloads":[
			"https://rarbg.to/torrents.php?search=brooklyn+nine-nine+720p",
			"https://thepiratebay.org/search/720p%20web-dl%20x264%20aac%20brooklyn%20nine-nine/0/3/0"
		]
	},
	{
		"title":"Silicon Valley",
		"path":"List_of_Silicon_Valley_episodes",
		"anchor":"Ratings",
		"downloads":[
			"https://rarbg.to/torrents.php?search=silicon+valley+720p+webrip+amzn"
		]
	},
	{
		"title":"Last Week Tonight",
		"path":"List_of_Last_Week_Tonight_with_John_Oliver_episodes",
		"anchor":"References",
		"downloads":[
			"https://rarbg.to/torrents.php?search=last+week+tonight+720p"
		]
	},
	{
		"title":"Doom Patrol",
		"path":"Doom_Patrol_(TV_series)",
		"anchor":"Production",
		"downloads":[
			"https://rarbg.to/torrents.php?search=doom+patrol+1080p+dcu"
		]
	},
	{
		"title":"Mom",
		"path":"List_of_Mom_(TV_series)_episodes",
		"anchor":"References",
		"downloads":[
			"https://rarbg.to/torrents.php?search=mom+720p"
		]
	},
	{
		"title":"The Orville",
		"path":"The_Orville",
		"anchor":"Production",
		"downloads":[
			"https://rarbg.to/torrents.php?search=the+orville+720p",
			"https://thepiratebay.org/search/720p%20web-dl%20x264%20aac%20the%20orville/0/3/0"
		]
	},
	{
		"title":"Will and Grace",
		"path":"List_of_Will_%26_Grace_episodes",
		"anchor":"Webisode",
		"downloads":[
			"https://rarbg.to/torrents.php?search=will+and+grace+720p",
			"https://thepiratebay.org/search/720p%20web-dl%20x264%20aac%20will%20and%20grace/0/3/0"
		]
	},
	{
		"title":"Agents of SHIELD",
		"path":"List_of_Agents_of_S.H.I.E.L.D._episodes",
		"anchor":"References",
		"downloads":[
			"https://rarbg.to/torrents.php?search=agents+720p",
			"https://thepiratebay.org/search/720p%20web-dl%20x264%20aac%20agents/0/3/0"
		]
	},
	{
		"title":"Real Time with Bill Maher",
		"path":"Real_Time_with_Bill_Maher_(season_17)",
		"anchor":"References",
		"downloads":[
			"https://rarbg.to/torrents.php?search=real+time+with+bill+maher+720p"
		]
	},
	{
		"title":"_Marvel Week",
		"path":"https://torrentz2.eu/search?f=marvel+week"
	},
	{
		"title":"_Windows Weekly",
		"path":"http://twit.tv/ww"
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
	} else	if (show.title === '_Windows Weekly') {
		results.push(Object.assign({}, show, {
			"day": 4
		}))

		callback()
	} else {
		var url = 'https://en.wikipedia.org/wiki/' + show.path
		
	  request({
	    followAllRedirects: true,
	    url: url
	  }, function (error, response, body) {
	    if (!error) {
	      var dom = $(body),
					tables = dom.find('table.wikiepisodetable'),
					table = $(tables.last()),
					tmp = [],
					first,
				  next
			
				if (show.title === 'Will and Grace') {
					table = $(tables[tables.length-2])
				}
				
				if (show.title === 'Real Time with Bill Maher') {
					table = $(tables.first())
				}
				
				var rows = table.find('tr.vevent')
			
				for (var i = 0, j = rows.length; i < j; i++) {
					var ep = $(rows[i]),
						id = ep.find('th').first().attr('id').substring(2),
						txt = ep.find('span.published').text(),
						day
					
					// if (show.title === 'Game of Thrones') {
// 						txt = '2019-03-31'
// 					}
				
					if (txt.length > 0) {
						var dt = moment(txt).add(1, 'day'),
							str = dt.format('YYYY-MM-DD')

						if (i === 0) {
							first = str
						}
					
						day = Number.isNaN(dt.day()) ? day : dt.day()
					
						if (dt >= today) {
							if (next === undefined) {
								next = str
							}
						
							tmp.push({
								"ep": (i + 1),
								"dt": str
							})
						}
					}
				}
				
				results.push(Object.assign({}, show, {
					"first": first,
					"next": next,
					"day": day
					//"schedule": removeDuplicates(tmp)
				}))
				
				console.log('[' + day + '] ' + show.title + ' | ' + next)
				callback()
	    } else {
				console.log(show.title + '[ ' + url + ' ] : '  + error)
	    }
	  })		
	}
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