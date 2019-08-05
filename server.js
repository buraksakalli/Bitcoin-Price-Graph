'use strict';

const http = require('http');
const https = require('https');
const path = require('path');
const EventEmit = require('events');
const express = require('express');
const socketio = require('socket.io');
const port = process.env.port || 3000;

const url = "https://btcguess.buraksakalli.org/last";
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const events = new EventEmit();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', socket => {
    events.on('btcPrice', value => {
        socket.emit('btcPrice', value);
    });
    events.on('btcPrediction', value => {
        socket.emit('btcPrediction', value);
    });
});

setInterval(() => {
    var btcPrice = 0;
    https.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            console.log(body[0]['price']);
            btcPrice = body[0]['price'];
            events.emit('btcPrice', btcPrice);
        });
    });
    
}, 2000);

server.listen(port, () => console.log('Server started on: ', port));