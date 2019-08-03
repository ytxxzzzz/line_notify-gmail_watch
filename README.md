# GmailのWatchAPIによるメール監視→PubSub送信

## デプロイ方法
- GASの単体スクリプト(個別のGoogleシートと紐付かないやつ)を作る
  - Driveで`新規ーその他ーGoogleAppsScript`でスクリプトファイルを作る
- このリポジトリをローカルにCloneする
- `npm install`する
  - →TypeScript環境一式がインストールされる
- .clasp.jsonにスクリプトIDを指定してローカルのソースとGASファイルの紐付けを行う
  - ★スクリプトIDが外部に漏れるとたぶんやばいので、ちゃんとgitignoreされていることを確認すること！！
- このコードをclaspでデプロイ
  - デプロイは`clasp push`で行う
  - ※claspコマンドはnode_modulesにインストールされるので、`./node_modules/.bin`をパスに追加するなど必要
  - 実装するのはTypeScriptの`.ts`ファイルだが、アップロードするのは`.gs`ファイル。
    - 勝手にトランスパイルされるので、tsファイルだけ意識していれば良い
- スクリプトプロパティを設定
  - GASの画面の`ファイループロジェクトのプロパティ`で表示されるダイアログのスクリプトプロパティに以下の値をセットする
    - gmail_watch_label
      - これは監視したいGmailのラベルのラベルIDを指定する
      - ラベルIDはラベル名とは違うので、適宜GASの`loggingGmailLabels`関数を実行してラベルIDを調べて指定する
    - gmail_watch_pubsub_topic
      - 指定したラベルのメールを受信した時に、PubSub通知したい通知先のPusSubトピック名を指定する
      - PubSubトピックの作成は後述する
- GCPプロジェクトにPubSubトピックとサブスクリプションを作成する
  - 作成するだけではダメで、以下の権限付与が必要
  - `gmail-api-push@system.gserviceaccount.com`に、`Pub/Sub Publisher`の権限付与
  - 作成したトピック名を前述のスクリプトプロパティへ設定する
- 他に、GCP側のAPIを有効化したりする必要があるかも
  - GmailとかPubSubとか？適宜APIを有効化する
  - ちなみに、GAS側のGmailAPI有効化は、`src/appsscript.json`で既に設定されているので明示的に行う必要はない(はず)

以上で、デプロイ完了し、指定したラベルIDのメールを受信するとPubSubトピックへPublishされ、サブスクリプションへ通知が配信されるはず。あとはCloudFunction等で処理してやれば良い。
