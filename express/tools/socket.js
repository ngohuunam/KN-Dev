const socket_io = require('socket.io')
const setting = require('../setting')
const nano = require('nano')(setting.couchdb)
const db = {
  orders: nano.db.use('orders'),
  products: nano.db.use('products'),
  plans: nano.db.use('plans'),
  jobs: nano.db.use('jobs'),
}
const io = socket_io()
const skApi = {}

skApi.io = io

io.on('connection', socket => {
  console.log('A user connected')
  socket.on('all', message => {
    // console.log(message)
    const _col = message
    db[_col].list({ include_docs: true }).then(body => {
      const _docs = []
      body.rows.map(row => {
        // output each document's body
        const _doc = row.doc
        // console.log(_doc)
        _docs.push(_doc)
      })
      io.sockets.emit('all', { state: _col, value: _docs })
    })
  })
})

skApi.sendNotification = (EVENT, data) => {
  io.sockets.emit(EVENT, data)
}

module.exports = skApi
