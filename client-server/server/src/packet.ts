import * as crypto from 'crypto';

export class Layer1 {
    type: string;
    version: number;
    ttl: number;
    size: number = 6;

    constructor(packet: Uint8Array) {
        const type = ('0000' + packet[0].toString(16) + packet[1].toString(16)).slice(-4); // 4桁の文字列にする
        if(type === '0000') {
            this.type = 'tcp'
        } else if(type === 'ffff') {
            this.type = 'udp'
        }
        this.version = parseInt(packet[2].toString(16) + packet[3].toString(16));
        this.ttl = parseInt(packet[4].toString(16) + packet[5].toString(16));
    }

    public output() {
        console.log('\n'+'--- layer1 -------------');
        console.log('type ------ ' + this.type);
        console.log('version --- ' + this.version);
        console.log('ttl ------- ' + this.ttl);
        console.log('--- end ----------------'+'\n');
    }
};

export class Layer2 {
    type: string;
    len: number;
    digest: string;
    size: number = 4;
    isSafe: boolean = true;

    constructor(packet: Uint8Array, protocol: string) {
        this.type = packet[0].toString(16) + packet[1].toString(16);
        this.len = parseInt(packet[2].toString(16) + packet[3].toString(16));
        if(protocol === 'tcp') {
            this.digest = ('00000000' + 
                packet[4].toString(16) + 
                packet[5].toString(16) + 
                packet[6].toString(16) + 
                packet[7].toString(16)).slice(-8); // 8桁の文字列にする
            // ペイロード部分
            const data = Buffer.from(packet.slice(8, packet.length));
            const digest = ('00000000' + this.md5hex(data)).slice(-8); // 4桁の文字列にする
            this.isSafe = (this.digest === digest);
            this.size += 4;
        }
    }

    public output() {
        console.log('\n' + '--- layer2 -------------');
        console.log('type ------ ' + this.type);
        console.log('len ------- ' + this.len);
        this.digest ? console.log('digest ------- ' + this.digest) : '';
        console.log('--- end ----------------' + '\n');
    }

    // 文字列からmd5を返す
    private md5hex(buf: Buffer) {
        const md5hash = crypto.createHash('md5');
        md5hash.update(buf);
        return md5hash.digest('hex');
    };
}

export class Payload {
    payload: Uint8Array;
    constructor(payload: Uint8Array) {
        this.payload = payload;
    }

    public output() {
        console.log('\n' + '--- payload -------------');
        console.log(this.payload);
        console.log('--- end ----------------' + '\n');
    }
}