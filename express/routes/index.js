const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
// const path = require('path')
// const setting = require('../setting')
// const nano = require('nano')(setting.couchdb)

router.get('/', function(req, res) {
  // res.sendFile(path.resolve(`pages/login/page.html`))
  res.render('login', { message: 'Type Email & Password and Login', email: 'huunam@kimnamdesign.com', password: '123' })
})

router.post('/signup', (req, res, next) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      console.error(err)
      return next(err)
    }
    if (info) {
      console.error(info.message)
      if (info.message === 'User Existed') res.status(401).send(info.message)
      else res.status(403).send(info.message)
    } else {
      req.logIn(user, { session: false }, error => {
        if (error) {
          console.error(error)
          return next(error)
        }
        res.status(200).send({ message: 'Signup successful', user: user })
      })
    }
  })(req, res, next)
})

router.post('/', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        console.error(err)
        return next(err)
      }
      if (info) res.render('error', { message: `<p>${info.message}</p>`, email: `"${req.body.email}"`, password: `"${req.body.password}"` })
      else {
        req.login(user, { session: false }, async error => {
          if (error) {
            console.error(error)
            return next(error)
          }
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { _id: user._id, email: user.email }
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user: body }, 'top_secret')
          //Send back the token to the user
          console.log('signed token', token)
          res.render(user.dept, { token: token, dept: user.dept })
          // return res.redirect('/sales/' + token)
          // res.sendFile(path.resolve(`pages/${user.path}/page.html`))
          // return res.status(200).send({
          //   auth: true,
          //   token,
          //   depart: user.path,
          //   message: 'Authenticated',
          // })
        })
      }
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

module.exports = router
