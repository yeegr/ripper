const express = require('express'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  http = require('http'),
  port = 10001,
  app = express(),
  router = express.Router()

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
  app.use(errorHandler())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(cors())

const wiki = require('./wiki')(app),
  bt = require('./bt')(app)

router.use((req, res, next) => {
  next()
})

router.get('/', (req, res, next) => {
  console.log(req.query)
})

// REGISTER ROUTES
// =============================================================================
app.use('/', router)

// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Environmental variables: ', process.env)
console.log('Graphics server running on port ' + port)
console.log('====================================')
