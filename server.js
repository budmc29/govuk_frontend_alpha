const express = require('express')
const app = express()
const path = require('path')
const nunjucks = require('nunjucks')

module.exports = app

// Set up App
const appViews = [
  path.join(__dirname, '/app/views/'),
  path.join(__dirname, '/app/templates/'),
  path.join(__dirname, '/app/components/')
]

nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

// Set views engine
app.set('view engine', 'html')

// Serve static content for the app from the "public" directory
app.use('/public', express.static(path.join(__dirname, '/public')))

// Send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path = '/public/'
  next()
})

// Render views/index
app.get('/', function (req, res) {
  let button = require('./app/fixtures/components/button.json')
  let buttonPrimary = require('./app/fixtures/components/button-primary.json')
  res.render('index', { button: button, buttonPrimary: buttonPrimary })
})

// Log when app is running
app.listen(3000, function () {
  console.log('GOV.UK Frontend Alpha\n')
  console.log('Listening on port 3000   url: http://localhost:3000')
})
