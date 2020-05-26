import * as crypto from 'crypto';

export class Packet {

    private layer1: layer1;
    private layer2: layer2;
    private data: Uint8Array;
    // 送信に使用するヘッダを結合したデータ
    public combData: Uint8Array;

    constructor(protocol: string, binary: string) {
        // ペイロード部分
        this.data = Uint8Array.from(Buffer.from(binary, 'hex'));
        // レイヤ2の情報
        this.layer2 = new layer2(protocol, Buffer.from(binary, 'hex'));
        // レイヤ1の情報
        this.layer1 = new layer1(protocol);
        // 結合後のデータの長さを確保
        this.combData = new Uint8Array(this.layer1.size + this.layer2.size + this.data.length)
    }

    public createCombData() {
        let pos = 0;
        pos = this.combL1(pos);
        pos = this.combL2(pos);
        this.pushToComData(this.data, pos);
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
        this.version = Uint8Array.from([0x00, 0x01]);
        this.ttl = Uint8Array.from([0x00, 0x05]);

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
    size: number = 4;

    constructor(protocol: string, binary: Buffer) {
        this.type = Uint8Array.from([0xdd, 0xdd]); // L3(Data)のタイプにDDDDを設定
        const len = ('0000' + binary.length.toString(16)).slice(-4); // 4桁の文字列にする
        this.len = Uint8Array.from([parseInt(len.slice(0, 2), 16), parseInt(len.slice(2, 4), 16)]); // 前半後半で切り分けて格納

        // プロトコルがTCPの場合にはmd5を設定する
        switch (protocol) {
            case 'tcp':
            case 'TCP':
                const digest = ('00000000' + this.md5hex(binary)).slice(-8); // 4桁の文字列にする
                this.digest = Uint8Array.from([
                    parseInt(digest.slice(0, 2), 16), 
                    parseInt(digest.slice(2, 4), 16),
                    parseInt(digest.slice(4, 6), 16),
                    parseInt(digest.slice(6, 8), 16)]); // 前半後半で切り分けて格納
                this.size += 4;
                break;
        }
    }

    // 文字列からmd5を返す
    private md5hex(buf: Buffer) {
        const md5hash = crypto.createHash('md5');
        md5hash.update(buf);
        return md5hash.digest('hex');
    };
};
