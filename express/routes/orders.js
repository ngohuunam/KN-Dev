const express = require('express')
const router = express.Router()
const setting = require('../setting')
const nano = require('nano')(setting.couchdb)
let list = nano.db.use('order_list_2020')
let detail = nano.db.use('order_detail_2020')

/* GET Planning Department page. */
router.get('/all/list/:seq', function(req, res, next) {
  const _seq = req.params.seq
  console.log('_seq', _seq)
  list.info().then(body => {
    console.log('update_seq', body.update_seq)
    if (_seq === body.update_seq) {
      res.sendStatus(204)
    } else {
      const update_seq = body.update_seq
      const _docs = []
      list.list({ include_docs: true }).then(body => {
        body.rows.map(doc => {
          console.log(doc.doc._rev)
          _docs.push(doc.doc)
        })
        res.json({ state: 'orderList', data: _docs, update_seq: update_seq })
      })
    }
  })
})

router.get('/detail/:id', function(req, res, next) {
  const _id = req.params.id
  detail.get(_id).then(_doc => {
    res.json({ state: 'orderDetails', data: _doc })
  })
})

module.exports = router
