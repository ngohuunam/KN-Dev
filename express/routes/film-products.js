const express = require('express')
const router = express.Router()
const setting = require('../setting')
const nano = require('nano')(setting.couchdb)
const orders = nano.db.use('products_film_2020')

router.get('/all/:seq', function(req, res, next) {
  const _seq = req.params.seq
  orders.info().then(body => {
    console.log('update_seq', _seq === body.update_seq)
    if (_seq === body.update_seq) {
      res.sendStatus(204)
    } else {
      const update_seq = body.update_seq
      const _docs = []
      orders.list({ include_docs: true }).then(body => {
        body.rows.map(row => {
          console.log(row)
          _docs.push(row.doc)
        })
        res.json({ list: _docs, seq: update_seq })
      })
    }
  })
})

router.post('/', function(req, res, next) {
  const _newOrder = req.body
  console.log('body', req.body)
  orders
    .insert(_newOrder)
    .then(doc => {
      console.log(doc)
      if (doc.ok) res.json(doc)
      else res.sendStatus(204)
    })
    .catch(e => {
      console.log(e)
      res.sendStatus(e.statusCode)
    })
})

router.get('/detail/:id', function(req, res, next) {
  const _id = req.params.id
  detail.get(_id).then(_doc => {
    res.json({ state: 'orderDetails', data: _doc })
  })
})

module.exports = router
