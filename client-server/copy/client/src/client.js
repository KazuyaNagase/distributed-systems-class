'use strict';
import { Packet } from '../../model/packet';
const net = require('net');
const execSync = require('child_process').execSync;

const socket = new net.Socket();
const packet = new Packet(socket);

// 引数を受け取る
const protocol = process.argv[2];
const fileName = process.argv[3];

// バイナリ形式ファイルを読み込む
// nodeのfs(file system)にbinary modeが見つからなかったため、ホストのコマンドを実行、xxd -p 'fileName'の出力を受け取る
const binary = execSync('xxd -p resource/' + fileName).toString();

const L1Data = packet.createL1Header(protocol);
const L2Data = packet.createL2Header(protocol, binary);

// ヘッダとデータを結合
const data = combHeader(L1Data, L2Data, binary);

// port: 2434, localhostに接続
socket.connect('2434', 'localhost', function () {
    console.log('--- connected to server ----------------------');
    socket.write(data);
});

// データを送信
socket.on('data', () => {
    console.log('Response -> received');
});

// コネクションを切断
socket.on('close', function () {
    console.log('socket-> connection is closed');
});
