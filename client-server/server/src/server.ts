import { Layer1, Layer2, Payload } from './packet';

import * as net from 'net';

let server = net.createServer();
server.maxConnections = 10;

let clients = {};
let clientsCounter = 0;

server.on('connection', (socket) => {
    clients[++clientsCounter];

    console.log('--- client No.' + clientsCounter + ' connection starts ---------------------------');

    socket.on('data', (data) => {
        const layer1 = new Layer1(data);
        if(layer1.isSafe) 
    });

    socket.on('close', function () {
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
    const addr = server.address() as net.AddressInfo;
    console.log('Listening Start on Server --- ' + addr.address + '-' + addr.port +'-------------------');
});

server.listen(2434, '127.0.0.1');