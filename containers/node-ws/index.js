const express = require('express')
const http = require('http')

const WebSocket = require('ws')

const app = express()
//
// Serve static files from the 'public' folder.
//
app.use(express.static('frontend/build'))

//
// Create an HTTP server.
//
const server = http.createServer(app)

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocket.Server({
  clientTracking: true,
  server
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

//
// Start the server.
//
server.listen(8080, function() {
  console.log('Listening on 8080')
})
