const net = require('net');

const client = new net.Socket();

// 引数を受け取る
const protocol = process.argv[2];
const fileName = process.argv[3];

let data = '';

// port: 2434, localhostに接続
client.connect('2434', 'localhost', function () {
    console.log('--- connected to server ----------------------');

    // 必要なデータを揃える
    const binary = openFile(fileName);
    const L1Data = setL1Header(protocol);
    const L2Data = setL2Header(binary);

    data = combHeader(L1Data, L2Data, binary);
});

// データを送信
client.on('data', function (data) {
    console.log('client-> send data');
});

// コネクションを切断
client.on('close', function () {
    console.log('client-> connection is closed');
});

// ファイルを開き、中身を返す
const openFile = (fileName) => {

}

// L1ヘッダを追加する
const setL1Header = (protocol) => {

}

// L2ヘッダを追加する
const setL2Header = (protocol) => {

}

// ヘッダ同士を結合する
const combHeader = (L1, L2, binary) => {
    return L1 + L2 + binary;
}
