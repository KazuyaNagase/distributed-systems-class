import { Packet } from './packet';

import * as net from 'net';
import * as childProcess from 'child_process';

// 引数を受け取る
const protocol = process.argv[2];
const fileName = process.argv[3];

// バイナリ形式ファイルを読み込む
// nodeのfs(file system)にbinary modeが見つからなかったため、ホストのbashを実行、xxd -p 'fileName'の出力を受け取る(1024バイト以上は切り捨てる)
const str = childProcess.execSync('xxd -p resource/' + fileName).toString().slice(0, 1024);

// 送信するpacketを作成
const packet = new Packet(protocol, str);
// ヘッダとデータを結合
packet.createCombData();

// socketを用意
const socket = new net.Socket();

// port: 2434, localhostに接続
socket.connect(2434, 'localhost', function () {
    console.log('--- connected to server ----------------------');
    socket.write(packet.combData); // serverにデータを送信
});

// データを送信
socket.on('data', () => {
    console.log('Response -> received');
});

// コネクションを切断
socket.on('close', function () {
    console.log('socket-> connection is closed');
});
