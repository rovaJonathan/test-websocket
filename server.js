const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected WebSocket clients
let clients = [];

wss.on('connection', function connection(ws) {
  console.log('A new WebSocket client connected!');
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

// HTTP endpoint /hello
app.post('/', express.json(), (req, res) => {
  const data = req.body;
  console.log('Received data on /:', data);

  // Broadcast data to all connected WebSocket clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    } 
  });

  res.send({ message: 'Data sent to WebSocket clients' });
});

server.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});
