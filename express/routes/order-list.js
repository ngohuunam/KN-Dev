const express = require('express')
const router = express.Router()
const setting = require('../setting')
const nano = require('nano')(setting.couchdb)
const db = {
  orderList: nano.db.use('order_list_2020'),
}

/* GET Planning Department page. */
router.get('/', function(req, res, next) {
  db.orderList.list({ include_docs: true }).then(body => {
    body.rows.forEach(doc => {
      console.log(doc.doc)
    })
  })
  // res.render('index', { title: 'PLANNING DEPT.' })
})

module.exports = router
