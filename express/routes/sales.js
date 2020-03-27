const express = require('express')
const router = express.Router()
const passport = require('passport')
// const jwt = require('jsonwebtoken')
const path = require('path')
// const setting = require('../setting')
// const nano = require('nano')(setting.couchdb)

// eslint-disable-next-line no-unused-vars
router.get(
  '/:token/:file',
  function(req, res, next) {
    console.log(req.path.split('/'))
    console.log(req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    req.fileGet = req.params.file
    return next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  // eslint-disable-next-line no-unused-vars
  (req, res, next) => res.sendFile(path.resolve(`public/sales/${req.fileGet}`)),
)
// eslint-disable-next-line no-unused-vars
router.get(
  '/:token/:folder1/:file',
  function(req, res, next) {
    console.log(req.path.split('/'))
    console.log(req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    req.fileGet = req.params.folder1 + '/' + req.params.file
    return next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  // eslint-disable-next-line no-unused-vars
  (req, res, next) => res.sendFile(path.resolve(`public/sales/${req.fileGet}`)),
)

// eslint-disable-next-line no-unused-vars
router.get(
  '/:token/:folder1/:folder2/:file',
  function(req, res, next) {
    console.log(req.path.split('/'))
    console.log(req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    req.fileGet = req.params.folder1 + '/' + req.params.folder2 + '/' + req.params.file
    return next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  // eslint-disable-next-line no-unused-vars
  (req, res, next) => res.sendFile(path.resolve(`public/sales/${req.fileGet}`)),
)

module.exports = router
