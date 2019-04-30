import * as crypto from 'crypto';

export class Packet {

    private layer1: layer1;
    private layer2: layer2;
    private data: Uint8Array;
    // 送信に使用するヘッダを結合したデータ
    public combData: Uint8Array;

    constructor(protocol: string, binary: string) {
        // レイヤ1の情報
        this.layer1 = new layer1(protocol);
        // レイヤ2の情報
        this.layer2 = new layer2(protocol, binary);
        // ペイロード部分
        this.data = Uint8Array.from(Buffer.from(binary, 'hex'));
        // 結合後のデータの長さを確保
        this.combData = new Uint8Array(this.layer1.size + this.layer2.size + this.data.length)
    }

    public createCombData() {
        let pos = 0;
        pos = this.combL1(pos);
        pos = this.combL2(pos);
        this.pushToComData(this.data, pos);
        console.log(this.combData);
    }

    private combL1(pos: number) {
        pos = this.pushToComData(this.layer1.type, pos);
        pos = this.pushToComData(this.layer1.version, pos);
        pos = this.pushToComData(this.layer1.ttl, pos);
        return pos;
    }

    private combL2(pos: number) {
        pos = this.pushToComData(this.layer2.type, pos);
        pos = this.pushToComData(this.layer2.len, pos);
        if(this.layer2.digest) {
            pos = this.pushToComData(this.layer2.digest, pos);
        }
        return pos;
    }

    // 引数に渡したUint8Arrayのデータを後ろにくっつける
    private pushToComData(segments: Uint8Array, pos: number) {
        const sumLength = segments.length * Uint8Array.BYTES_PER_ELEMENT;
        this.combData.set(segments, pos );
        return pos + sumLength;
    }
}

class layer1 {
    type: Uint8Array;
    version: Uint8Array;
    ttl: Uint8Array;
    size:number = 6;

    constructor(protocol: string) {
        this.version = Uint8Array.from([0x00, 0x05]);
        this.ttl = new Uint8Array(2);

        // protocolでtypeをTCP(0000)/UDP(FFFF)を設定する
        switch(protocol) {
            case 'tcp':
            case 'TCP':
                this.type = Uint8Array.from([0x00, 0x00]);
                break;
            case 'udp':
            case 'UDP':
                this.type = Uint8Array.from([0xff, 0xff]);
                break;
        }
    }
}

class layer2 {
    type: Uint8Array;
    len: Uint8Array;
    digest: Uint8Array;
    size: number = 6;

    constructor(protocol: string, binary: string) {
        this.type = Uint8Array.from([0xdd, 0xdd]); // L3(Data)のタイプにDDDDを設定
        const len = ('0000' + binary.length.toString(16)).slice(-4); // 4桁の文字列にする
        this.len = Uint8Array.from([parseInt(len.slice(0, 2), 16), parseInt(len.slice(2, 4), 16)]); // 前半後半で切り分けて格納

        // プロトコルがTCPの場合にはmd5を設定する
        switch (protocol) {
            case 'tcp':
            case 'TCP':
                const digest = ('0000' + this.md5hex(binary)).slice(-4); // 4桁の文字列にする
                this.digest = Uint8Array.from([parseInt(digest.slice(0, 2), 16), parseInt(digest.slice(2, 4), 16)]); // 前半後半で切り分けて格納
                this.size += 6;
                break;
        }
    }

    // 文字列からmd5を返す
    private md5hex(src: string) {
        const md5hash = crypto.createHash('md5');
        md5hash.update(src, 'utf8');
        return md5hash.digest('hex');
    };
};
