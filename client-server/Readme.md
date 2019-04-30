##  構成

最終的にはnodeのライブラリ(net)[https://nodejs.org/api/net.html]を使用したソケット通信をしています

client/server共に、TypeScriptで書いたnodeのコードをts-loder(TypeScirptのコンパイラ)でnodeにコンパイルし、webpack(jsのモジュールハンドラ)で単一ファイル(dist/main.js)にまとめ、そのmain.jsを実行してソケット通信を行います。



## 実行方法

0. client/serverフォルダに移動

   ```cd client or server```

1. ライブラリ依存関係の解決

   ```npm install```

2. TypeScriptをコンパイルして単一ファイルにまとめる

   ```npm run build```

3. 作成したファイルを実行

   ```node ./dist/main.js```
   ```node ././dist/main.js (tcp or udp) (fileName(client/resource配下のファイルを指定)) ```

でclient/serverが起動します
