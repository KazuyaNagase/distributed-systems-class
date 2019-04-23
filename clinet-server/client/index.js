'use strict';
const net = require('net');
const execSync = require('child_process').execSync;

import { Client } from '../model/client.js';

const socket = new net.Socket();
const client = new Client(socket)

// 引数を受け取る
const protocol = process.argv[2];
const fileName = process.argv[3];

// バイナリ形式ファイルを読み込む
// nodeのfs(file system)にbinary modeが見つからなかったため、ホストのコマンドを実行、xxd -p 'fileName'の出力を受け取る
const binary = execSync('xxd -p resource/' + fileName).toString();

const L1Data = client.createL1Header(protocol);
const L2Data = client.createL2Header(protocol, binary);

// ヘッダとデータを結合
const data = combHeader(L1Data, L2Data, binary);

// port: 2434, localhostに接続
socket.connect('2434', 'localhost', function () {
    console.log('--- connected to server ----------------------');
});

// データを送信
socket.on('data', (data) => {
    console.log('socket-> send data');
    socket.write(data);
});

// コネクションを切断
socket.on('close', function () {
    console.log('socket-> connection is closed');
});
