'use strict';

var _client = require('../../model/packet');

var net = require('net');
var execSync = require('child_process').execSync;

var socket = new net.Socket();
var client = new _client.Client(socket);

// 引数を受け取る
var protocol = process.argv[2];
var fileName = process.argv[3];

// バイナリ形式ファイルを読み込む
// nodeのfs(file system)にbinary modeが見つからなかったため、ホストのコマンドを実行、xxd -p 'fileName'の出力を受け取る
var binary = execSync('xxd -p resource/' + fileName).toString();

var L1Data = client.createL1Header(protocol);
var L2Data = client.createL2Header(protocol, binary);

// ヘッダとデータを結合
var data = combHeader(L1Data, L2Data, binary);

// port: 2434, localhostに接続
socket.connect('2434', 'localhost', function () {
    console.log('--- connected to server ----------------------');
    socket.write(data);
});

// データを送信
socket.on('data', function () {
    console.log('Response -> received');
});

// コネクションを切断
socket.on('close', function () {
    console.log('socket-> connection is closed');
});