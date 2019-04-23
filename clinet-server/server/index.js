'use strict';
const net = require('net');
const crypto = require('crypto');
const Client = require('../model/client.js');

// 対応表のMemo
let layer2protocol = {
    tcp: '0000',
    udp: 'FFFF'
}

let server = net.createServer();
server.maxConnections = 10;

let clients = {};
let clientsCounter = 0;

server.on('connection', (socket) => {
    clients[++clientsCounter] = new Client(socket);

    console.log('--- client No.' + clientsCounter + ' connection starts ---------------------------');

    socket.on('data', (data) => {
        // 8bitバイナリ形式に変換
        binary = new Uint8Array(data.length);
        console.log(binary);
        Client.parseL1Header(binary);
        Client.parseL2Header(binary, ischeck);
        Client.dataLogger(binary);
    });

    socket.on('close', function (socket) {
        console.log('--- client No.' + clientsCounter + ' connection end ---------------------------');
        clientsCounter--;
    });
});

server.on('close', function () {
    console.log('Server Closed');
});

process.on('SIGINT', function () {
    for (var i in clients) {
        var socket = clients[i].socket;
        socket.end();
    }
    server.close();
});

server.on('listening', function () {
    var addr = server.address();
    console.log('Listening Start on Server --- ' + addr.address + ':' + addr.port + '-------------------');
});

server.listen(2434, '127.0.0.1');