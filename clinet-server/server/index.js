'use strict';
let net = require('net');

let server = net.createServer();
// server.maxConnections = 10;

function Client(socket) {
    this.socket = socket;
}

Client.prototype.writeData = (d) => {
    let socket = this.socket;
    if(socket.writable) {
        // client側に送信するメッセージ
    }
}

// L2をパースして結果を返す
Client.prototype.parseLayer1 = (ip) => {

}

// L3をパースして結果を返す
Client.prototype.parseLayer2 = (protocol) => {

}

// データを標準出力で表示
Client.prototype.dataLogger = (data) => {

}

let clients = {};
let clientsCounter = 0;

server.on('connection', function (socket) {
    clients[++clientsCounter] = new Client(socket);

    console.log('--- client No.' + clientsCounter + ' connection starts ---------------------------');

    socket.on('send', function (data) {

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