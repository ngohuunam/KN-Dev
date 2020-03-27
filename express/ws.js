const setting = require('./setting')

const nano = require('nano')(setting.couchdb)
const db = {
  plans: nano.db.use('plans'),
}

const ews = {}

ews.init = server => {
  const WebSocket = require('ws')
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
      done(true)
    },
  })

  setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping(() => {})
    })
  }, 30000)

  wss.on('connection', async (ws, req) => {
    ws.send(JSON.stringify({ protocol: ws.protocol + ' connected', func: 'connected' }))
    ws.isAlive = true
    ws.on('pong', function heartbeat() {
      this.isAlive = true
    })
    ws.on('message', async msg => {
      const query = JSON.parse(msg)
      console.log(query)
    })
    ws.on('error', err => {
      console.log(`Client disconnected - reason: ${err}`)
    })
  })
}

module.exports = ews
