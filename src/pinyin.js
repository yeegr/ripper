const async = require('async'),
  { JSDOM } = require('jsdom'),
  chalk = require('chalk'),
  fs = require('fs'),
  path = 'https://hanyu.baidu.com/s?ptype=zici&wd='

var txt = [
  "严肃",
  "清晰",
  "振动",
  "胸怀",
  "怀抱",
  "赞美",
  "效率",
  "出租",
  "疑惑",
  "平凡",
  "照顾",
  "训斥",
  "出塞",
  "秦朝",
  "出征",
  "组词",
  "催眠",
  "沉醉",
  "杰出",
  "英雄",
  "项目",
  "亦然",
  "尝试",
  "诸多",
  "竞走",
  "唯一",
  "豹子",
  "灌溉",
  "派去",
  "娶亲",
  "媳妇",
  "淹没",
  "扔掉",
  "逼迫",
  "漂浮",
  "干旱",
  "徒弟",
  "富饶",
  "欺骗"
]

var results = [],
  errors = []

module.exports = function(app) {
  app.get('/py', function(req, res, next) {
		async.eachSeries(txt, (value, callback) => {
			setTimeout(() => {
				getPinyinFromBaidu(value, callback)
			}, 1000)			
		}, (err) => {
      if (err) console.error(err.message)
      
      console.log(errors)
				
			fs.writeFile('./dev/chars.json', JSON.stringify(results), {encoding: 'utf8', flag: 'w'},  (e) => {
				if (e) console.error(e.message)
				res.status(200).send(results)
				results = []
			})
		})
  })
}

function getPinyinFromBaidu(txt, callback) {
  let url = path + txt

  JSDOM.fromURL(url, {}).then(dom => {
    const {document} = dom.window,
      tmp = document.querySelector('#pinyin h2 span b'),
      py = tmp ? tmp.innerHTML.replace(/\[|\]/g, '').trim() : ""

    let arr = []
    arr.push(txt)
    arr.push(py)

    if (!tmp) errors.push(txt)
    console.log(tmp ? txt : chalk.red(txt))
    
    results.push(arr)

    callback()
  })
}