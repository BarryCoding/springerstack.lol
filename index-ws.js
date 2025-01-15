const express = require('express')
const server = require('http').createServer()
const app = express()

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)
server.listen(3000, function () {
  console.log('server start on port 3000')
})

/** Begin Websocket */
const WebsocketServer = require('ws').Server

const wss = new WebsocketServer({ server })

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size
  console.log(`🔎 🔍 ~ connection ~ numClients:`, numClients)

  wss.broadcast(`Current visitors: ${numClients}`)
  if (ws.readyState === ws.OPEN) {
    ws.send('welcome to my server')
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClients}`)
    console.log('A client has disconnected')
  })
})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data)
  })
}
