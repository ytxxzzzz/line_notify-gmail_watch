function loggingGmailLabels() {
    // GMailのWatchによるラベル監視をするにはラベルIDが必要なので、この関数でラベルIDを調べられる
    // 結果はログ(StackDriverlogging)に出力される
    const response = Gmail.Users.Labels.list("me");
    if (response.labels.length === 0) {
        console.info("No labels found.");
    } else {
        console.info("Labels:");
        for (const label of response.labels) {
            console.info(`ラベル名:${label.name}, ラベルID:${label.id}`);
        }
    }
}

// Gmailのラベルを監視設定する。数日おきに定期実行しないと監視状態解除される
function doGmailWatch() {
    // gmail watch APIのリクエスト
    const request: GoogleAppsScript.Gmail.Schema.WatchRequest = {
        labelIds: [PropertiesService.getScriptProperties().getProperty("gmail_watch_label")],
        topicName: PropertiesService.getScriptProperties().getProperty("gmail_watch_pubsub_topic"),
    };

    // WatchAPIを実行することで、指定されたラベルのメールを受信した時にPubSubへPublishされる状態、いわば監視状態となる
    // ちなみにこの監視状態は、数日で切れるらしい。APIのレスポンスに期限が返却されているらしいが、固定で再実行するのが現実的かと。詳細は以下のURLにて
    // https://developers.google.com/gmail/api/v1/reference/users/watch
    const response = Gmail.Users.watch(request, "me");
    console.info("gmail watch API Succeded!!");
}
