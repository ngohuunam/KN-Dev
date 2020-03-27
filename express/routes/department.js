const express = require('express')
const router = express.Router()
const passport = require('passport')
const fs = require('fs')
// const jwt = require('jsonwebtoken')
const { resolve } = require('path')
// const setting = require('../setting')
// const nano = require('nano')(setting.couchdb)

router.get(
  ['/:dept/:token/:file', '/:dept/:token/:folder1/:file', '/:dept/:token/:folder1/:folder2/:file'],
  function(req, res, next) {
    // console.log(process.env)
    // console.log('/path', req.path.split('/'))
    // console.log('/params', req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    req.token = req.params.token
    req.fileGet = req.params.file
    req.resolvePath = `pages/${req.params.dept}${req.params.folder1 ? '/' + req.params.folder1 + (req.params.folder2 ? '/' + req.params.folder2 : '') : ''}/${req.fileGet}`
    console.log('req.resolvePath :', req.resolvePath)
    return next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  (req, res, next) => {
    if (req.fileGet.indexOf('.js') > -1) {
      fs.readFile(req.resolvePath, function(err, content) {
        if (err) return next(err)
        const _fixContent = content.toString().replace(/{{token}}/g, req.token)
        res.send(_fixContent)
      })
    } else res.sendFile(resolve(req.resolvePath))
  },
)

module.exports = router
