const express = require('express')
const router = express.Router()
const setting = require('../setting')
const nano = require('nano')(setting.couchdb)
const db = {
  jobs: nano.db.use('jobs'),
}

/* GET Planning Department page. */
router.get('/', function(req, res, next) {
  db.jobs.list({ include_docs: true }).then(body => {
    body.rows.forEach(doc => {
      console.log(doc.doc)
    })
  })
  // res.render('index', { title: 'PLANNING DEPT.' })
})

module.exports = router
