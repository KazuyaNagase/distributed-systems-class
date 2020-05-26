import { Layer1, Layer2, Payload } from './packet';

import * as net from 'net';

let server = net.createServer();
server.maxConnections = 10;

let clients = {};
let clientsCounter = 0;

server.on('connection', (socket) => {
    clients[++clientsCounter];

    console.log('--- client No.' + clientsCounter + ' connection starts ');

    socket.on('data', (packet) => {
        // layer1をparses
        const layer1 = new Layer1(packet);
        layer1.output();

        // layer2をparse
        const l2 = packet.slice(layer1.size, packet.length);
        const layer2 = new Layer2(l2, layer1.type);
        if (layer2.isSafe) {
            layer2.output();
        } else {
            socket.end(); // チェックサムが正しくない場合には切断する
            return;
        }

        const p = packet.slice(layer1.size + layer2.size, packet.length);
        const payload = new Payload(p);
        payload.output();

        // 切断する
        socket.end(); 
    });

    socket.on('close', function () {
        console.log('--- client No.' + clientsCounter + ' connection end ');
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