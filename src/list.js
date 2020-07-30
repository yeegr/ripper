const { JSDOM } = require('jsdom')

module.exports = function(app) {
  app.get('/list', function(req, res, next) {
		const url = 'https://www.imdb.com/title/tt' + req.query.id + '/episodes?season=' + req.query.season

		console.log(url)

		let showList = ''

		JSDOM.fromURL(url, {}).then(dom => {
			const {document} = dom.window,
				wrapper = document.querySelectorAll('.eplist > div')

			wrapper.forEach((ep, i) => {
				let info = ep.querySelector('.info'),
					lnk = info.querySelector('strong a'),
					title = lnk.innerHTML.trim()

				showList += title + '<br>'
			})

			res.status(200).send(showList)
		})
  })
}