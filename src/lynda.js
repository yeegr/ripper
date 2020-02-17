const { JSDOM } = require('jsdom')

module.exports = function(app) {
  app.get('/lynda', function(req, res, next) {
    const url = 'https://www.lynda.com/' + req.query.path

    console.log(url)

    let chapterList = '',
      videoList = ''

    JSDOM.fromURL(url, {}).then(dom => {
      const {document} = dom.window,
        chapters = document.querySelectorAll('.course-toc > li')

      chapters.forEach((chapter, i) => {
        let h4 = chapter.querySelector('.chapter-row h4').innerHTML,
          tmp = h4.split('. '),
          num = addZero(i),
          title = num.toString() + ' ' + tmp[tmp.length-1],
          items = chapter.querySelectorAll('.toc-items > li')
        
        chapterList += title + '<br>'

        items.forEach((item, j) => {
          let name = item.querySelector('.video-row a.item-name').innerHTML.trim(),
            subject = num.toString() + addZero(1+j) + ' ' + name

          videoList += subject + '<br>'
        })
      })

      res.status(200).send(chapterList + '<br><br>' + videoList)
    })
  })
}

const addZero = (n) => (n < 10) ? '0' + n : n
