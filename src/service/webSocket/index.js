const WebSocket = require('ws');
const https = require('http'); // Menggunakan 'https' untuk server HTTPS
const express = require('express');
// const fs = require("fs");

// const privateKey = fs.readFileSync(process.env.KEY_PEM, "utf8");
// const certificate = fs.readFileSync(process.env.CERT_PEM, "utf8");
// const ca = fs.readFileSync(process.env.CA_PEM, "utf8");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
//   passphrase: process.env.PFX_PASSPHRASE,
// };

const app = express();
const httpsServer = https.createServer(app); 

const wss = new WebSocket.Server({ server: httpsServer });

const subscriptions = {}; 

// Fungsi untuk broadcast pesan ke klien berdasarkan topik
function broadcast(topic, message) {
    const clients = subscriptions[topic] || [];
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        const { action, topic } = parsedMessage;

        if (action === 'subscribe') {
            if (!subscriptions[topic]) {
                subscriptions[topic] = [];
            }
            subscriptions[topic].push(ws);
            console.log(`Client subscribed to topic: ${topic}`);
        }
    });

    ws.on('close', () => {
        for (const topic in subscriptions) {
            subscriptions[topic] = subscriptions[topic].filter(client => client !== ws);
        }
    });
});

// Setup express untuk melayani file statis
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 8726;
httpsServer.listen(PORT, () => {
    console.log(`WebSocket server is listening on port ${PORT}`);
});

module.exports = { broadcast };
