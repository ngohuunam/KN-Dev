const express = require('express')
const compression = require('compression')
// const fs = require('fs')
const { join } = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const setting = require('./setting')
const { html } = require('./tools/engine')
require('./tools/auth')

const indexRouter = require('./routes/index')
const filmOrdersRouter = require('./routes/film-orders')
const departmentRouter = require('./routes/department')

const app = express()
app.use(compression())
app.use(
  cors({
    // origin: '*',
    origin: setting.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.engine('html', html)
app.set('views', './pages') // specify the views directory
app.set('view engine', 'html') // register the template engine

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(join(__dirname, 'public/stylesheets')))

app.use('/', indexRouter)
app.use('/department/', departmentRouter)
app.use('/film/orders', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), filmOrdersRouter)

app.use(function(req, res) {
  res.status(404).send("Sorry can't find that!")
})
app.use(function(err, req, res) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

module.exports = app
