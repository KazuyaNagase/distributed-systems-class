'use strict';

// nodeモジュールの読み込み
const crypto = require('crypto');

export class Packet {
    // プルパティは持てないらしいのでコンストラクタに定義
    constructor(socket) {
        this.socket = socket;
        // レイヤ1の情報
        this.layer1 = {
            type: new Uint8Array(4),
            version: new Uint8Array(4),
            ttl: new Uint8Array(4)
        };
        // レイヤ2の情報
        this.layer2 = {
            type: new Uint8Array(4),
            len: new Uint8Array(4),
        };
        // DTCPで使用するチェックサム
        this.digest = new Uint8Array(4);
        // ヘッダ付きデータ
        this.data = new Uint8Array(1024);
        // 生データ
        this.binary = new Uint8Array(1024);
    }

    // L1をパースし、検査、取り除いたバイナリを返す
    parseL1Header = (binary) => {
        this.layer1.type = binary[1, 2, 3, 4];
        this.layer1.version = binary[5, 6, 7, 8];
        this.layer1.ttl = binary[9, 10, 11, 12];
        console.log('- layer1 ---------------------');
        console.log('--- type ' + layer1.type);
        console.log('--- version ' + layer1.version);
        console.log('--- ttl ' + layer1.ttl);
        console.log('- end ------------------------');
        // バイナリのL1ヘッダを除く
        return binary.slice(12, binary.legth - 12);
    }

    // L2をパースし、検査、取り除いたバイナリを返す
    parseL2Header = (binary) => {
        this.layer2.type = binary[1, 2, 3, 4];
        this.layer2.len = binary[5, 6, 7, 8];

        // バイナリのL2ヘッダを除く
        this.data = binary.slice(12, binary.legth - 12);

        // TCPだった場合にはデータをmd5で検査
        if (this.layer1.type === '0000') {
            this.digest = binary[1, 2, 3, 4];
            this.data = binary.slice(4, binary.legth - 4);

            let md5 = crypto.createHash('md5');
            const serverDigest = md5.update(this.data, 'binary');

            if (serverDigest === this.digest) {
                // エラーとして強制終了
            }
        }
        console.log('- layer2 ---------------------');
        console.log('--- type ' + layer1.type);
        console.log('--- version ' + layer1.version);
        this.digest ? console.log('--- digest ' + layer1.digest) : '';
        console.log('- end ------------------------');
    }

    // データを標準出力で表示
    dataLogger = (data) => {
        console.log(data);
    }

    // L1ヘッダを追加する
    createL1Header = (protocol) => {
        this.version = '0001';
        this.ttl = '0005';
        switch (protocol) {
            case 'TCP':
            case 'tcp':
                this.type = '0000'
                break;
            case 'UDP':
            case 'udp':
                this.type = 'FFFF'
                break;
        }
    }

    // L2ヘッダを追加する
    createL2Header = (protocol, binary) => {
        this.type = 'DA0A';
        this.len = binary.length;
        switch (protocol) {
            case 'TCP':
            case 'tcp':
                let md5 = crypto.createHash('md5');
                this.digest = md5.update(binary, 'binary');
                break;
        }
    }

    // ヘッダ同士を結合する
    combHeader = (L1, L2, binary) => {
        this.data = L1 + L2 + binary;
    }
}