import * as _ from 'underscore';
import * as net from 'net';

let timeStampSelf: number = null; // 自分自身のタイムスタンプ
let timeStampOther: number = null; // 他のクライアントのタイムスタンプ
let exeQueue: any = []; // 実行キュー

/*

 Serverを起動

*/
{
    // server 待ち受け開始　(8090)
    let server = net.createServer((connection) => {
        connection.on('data', (data) => {
            timeStampOther = parseInt(data.toString());
            exeQueue.push(timeStampOther);
            console.log('ACK1-2:  ' + timeStampOther);
            exeApp();
        });
        connection.on('error', () => {
            console.log('server: client made error');
        });
    }).listen(8080);
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
            timeStampSelf = input;
            exeQueue.push(parseInt(timeStampSelf.toString()));
            break;
        }
        console.log('入力形式にエラー')
    }

    // リクエストが始まる
    console.log('REQ1:  ' + timeStampSelf);

    // 自身にACKを送る処理で1追加
    console.log('ACK1-1:  ' + ++timeStampSelf);

    // clientを用意
    const client = new net.Socket();
    client.setEncoding('utf8');

    // port: 9090, localhostに接続
    client.connect(9090, 'localhost', () => {
        client.write(timeStampSelf.toString());
    });
}

// タイムスタンプを同期する
const lamport = () => {
    // 相手のほうが早ければ、相手ののタイムスタンプに+1して時刻を合わせる
    if (timeStampSelf < timeStampOther) {
        timeStampSelf = timeStampOther + 1;
        console.log('タイムスタンプを更新:  ' + timeStampSelf)
    }
}

// アプリケーションをキューから実行する
const exeApp = () => {
    if(_.first(exeQueue) === timeStampSelf) {
        console.log('execute Task -> 1');
        console.log('execute Task -> 2');
    } else {
        console.log('execute Task -> 2');
        console.log('execute Task -> 1');
    }
    lamport();
}