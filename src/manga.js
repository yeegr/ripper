const { JSDOM } = require('jsdom')

module.exports = function(app) {
  app.get('/manga', function(req, res, next) {
		const url = 'http://mangastream.today/chapter/onepunch-man-chapter-' + req.query.vol

		let linkList = ''

		JSDOM.fromURL(url, {}).then(dom => {
			const {document} = dom.window,
        wrapper = document.querySelector('p#arraydata'),
        links = wrapper.innerHTML.split(',')

      // console.log(wrapper.innerHTML)

      links.forEach((a) => {
        linkList += a + '<br>'
      })

			res.status(200).send(linkList)
		})
  })
}