import * as _ from 'underscore';
import * as net from 'net';

let timeStamp: number; // クライアントのタイムスタンプ

/*

 Serverを起動

*/
{
    // serverを用意
    let server = net.createServer();

    // Applicationを実行するQueue


    // server 待ち受け開始()
    server.on('connection', (socket) => {

        console.log('--- client No. connection starts ');

        // 通信開始
        socket.on('data', (data) => {

            // 切断する
            socket.end();
        });

        socket.on('close', function () {
            console.log('--- client No. connection end ');
        });
    });

    server.on('close', function () {
        console.log('Server Closed');
    });

    process.on('SIGINT', function () {
        server.close();
    });

    server.on('listening', function () {
        const addr = server.address() as net.AddressInfo;
        console.log('Listening Start on Server --- ' + addr.address + '-' + addr.port + '-------------------');
    });

    server.listen(8080, '127.0.0.1');
}
/*

 Clientを起動

*/
{
    //入力待機
    const readlineSync = require("readline-sync");
    console.log('タイムスタンプを入力してください (999以下の数字)'); //質問表示
    while (1) {
        const input = readlineSync.question() as number; //入力待ち
        if (input <= 999) {
            timeStamp = input;
            break;
        }
        console.log('入力形式にエラー')
    }


    // socketを用意
    const socket = new net.Socket();

    // port: 9090, localhostに接続
    socket.connect(9090, 'localhost', function () {
        console.log('--- client 02 start ----------------------');
        socket.write(timeStamp.toString()); // serverにデータを送信
    });

    // データを送信
    socket.on('data', () => {
        console.log('Response -> received');
    });

    // コネクションを切断
    socket.on('close', function () {
        console.log('socket-> connection is closed');
    });
}