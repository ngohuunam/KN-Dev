const express = require('express')
const router = express.Router()
const setting = require('../setting')
const socket = require('../tools/socket')
const crypto = require('../tools/crypto')

const nano = require('nano')(setting.couchdb)
const orders = nano.db.use('orders_film_2020')
// const products = nano.db.use('products_film_2020')

let dbSeq = ''

const getdbSeq = async () => {
  const _dbinfo = await orders.info()
  console.log('get dbSeq _dbinfo', _dbinfo)
  const _dbSeq = crypto.encrypt(_dbinfo.update_seq)
  console.log('get dbSeq', _dbSeq)
  return _dbSeq
}

const LOG = {
  type: '',
  key: '',
  reason: '',
  at: 0,
  by: {},
  note: '',
  _rev: '',
  lastVal: null,
  newVal: null,
}
Object.freeze(LOG)

const feed = orders.follow({ since: 'now', include_docs: true })
feed.on('change', async change => {
  console.log('change: ', change)
  dbSeq = await getdbSeq()
  const _doc = change.doc
  let _skEvent = 'ORDER_UPDATE'
  if (_doc._deleted === true) _skEvent = 'ORDER_DELETE'
  else if (_doc._rev.startsWith('1-')) _skEvent = 'ORDER_NEW'
  socket.sendNotification(_skEvent, { newDoc: _doc, newSeq: dbSeq })
})
feed.follow()

router.get('/sync', async function(req, res) {
  try {
    const _clientEncryptedSeq = req.query.seq
    if (!dbSeq) dbSeq = await getdbSeq()
    if (dbSeq === _clientEncryptedSeq) res.sendStatus(204)
    else {
      const _clientSeq = crypto.decrypt(_clientEncryptedSeq)
      // console.log('GET /sync _clientSeq', _clientSeq)
      const _changes = await orders.changes({ include_docs: true, since: _clientSeq })
      console.log('GET /sync orders.changes', _changes)
      const _docsChanged = _changes.results.map(r => r.doc)
      dbSeq = await getdbSeq()
      // console.log('GET /sync dbSeq', dbSeq)
      res.json({ docs: _docsChanged, seq: dbSeq })
    }
  } catch (e) {
    console.error(e)
  }
})

router.get('/list/:seq', async function(req, res) {
  try {
    const _clientEncryptedSeq = req.params.seq
    if (!dbSeq) {
      const _body = await orders.info()
      dbSeq = crypto.encrypt(_body.update_seq)
      console.log('dbSeq', dbSeq)
    }
    if (_clientEncryptedSeq === '1') {
      const _body = await orders.list({ include_docs: true })
      const _rows = _body.rows
      const _docs = _rows.map(row => row.doc)
      console.log('dbSeq', dbSeq)
      res.json({ docs: _docs, seq: dbSeq })
    }
    if (dbSeq === _clientEncryptedSeq) res.sendStatus(204)
    else {
      const _clientSeq = crypto.decrypt(_clientEncryptedSeq)
      console.log('_clientSeq', _clientSeq)
      const _changes = await orders.changes({ include_docs: true, since: _clientSeq })
      // const _rows = _body.rows
      // const _docs = _rows.map(row => row.doc)
      console.log('orders.changes', _changes)
      console.log('orders.changes.results', _changes.results)
      const _docsChanged = _changes.results.map(r => r.doc)
      console.log('_docsChanged', _docsChanged)
      res.json({ docs: _docsChanged, seq: _changes.last_seq })
      console.log('last_seq === dbSeq', _changes.last_seq === dbSeq)
    }
  } catch (e) {
    console.error(e)
  }
})

router.post('/', function(req, res) {
  const _newOrder = req.body
  _newOrder.createdAt = Date.now()
  /* create order log */
  const _log = { ...LOG }
  _log.type = 'Create'
  _log.at = _newOrder.createdAt
  _log.by = _newOrder.createdBy
  /* update order log */
  _newOrder.logs.push(_log)
  console.log('_newOrder', _newOrder)
  orders
    .insert(_newOrder)
    .then(doc => {
      console.log(doc)
      if (doc.ok) res.json(doc)
      else res.sendStatus(204)
    })
    .catch(e => {
      console.error(e)
      res.sendStatus(e.statusCode)
    })
})

const cloneOldOrder = order => {
  const _clone = JSON.parse(JSON.stringify(order))
  const _keyNeedDelete = ['hasChanged', 'keyHasChanged', 'logs', 'products']
  _keyNeedDelete.map(k => delete _clone[k])
  return _clone
}

router.post('/product', function(req, res) {
  /* get body info */
  const _newProd = req.body
  const _orderId = _newProd.orderId
  /* update new product */
  _newProd.createdAt = Date.now()
  console.log('_newProd', _newProd)
  /* get order that new product belong to from database */
  orders
    .get(_orderId)
    .then(_orderDoc => {
      /* Check _rev */
      if (_orderDoc._rev !== _newProd.orderRev) {
        console.error(`POST /product doc current _rev ${_orderDoc._rev} conflict:`, _newProd.orderRev)
        res.sendStatus(409)
      } else {
        /* clone and clean current order */
        _newProd.order = cloneOldOrder(_orderDoc)
        /* update current order */
        _orderDoc.status = 'New Product'
        _orderDoc.products.push(_newProd)
        _orderDoc.productNames += _orderDoc.productNames ? `, ${_newProd.name}` : _newProd.name
        /* create order log */
        const _log = { ...LOG }
        _log._rev = _newProd.order._rev
        _log.at = _newProd.createdAt
        _log.by = _newProd.createdBy
        _log.key = 'productNames'
        _log.lastVal = _newProd.order.productNames
        _log.newVal = _orderDoc.productNames
        _log.type = 'New Product'
        /* update order log */
        _orderDoc.logs.push(_log)
        console.log(`POST /product ORDERS get doc id ${_orderId}:`, _orderDoc)
        /* save updated order to database */
        orders.insert(_orderDoc).then(_orderRes => {
          console.log(`POST /product ORDERS insert doc id ${_orderId} result:`, _orderRes)
          /* check status */
          if (_orderRes.ok) res.json(_orderRes)
        })
      }
    })
    .catch(e => {
      console.error(e)
      res.sendStatus(e.statusCode)
    })
})

router.post('/delete', async function(req, res) {
  console.log(`POST /delete req body:`, req.body)
  try {
    const _dbRes = await orders.bulk({ docs: req.body })
    console.log(`POST /delete orders bulk response:`, _dbRes)
    res.json(_dbRes)
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
