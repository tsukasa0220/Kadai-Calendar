# MoodleCalendar
Moodleの情報はカレンダーの直近イベントから取得しています

<h2>注意事項</h2>
万一、このシステムによって利用者の不手際が発生しても一切保証を負えませんのでご了承ください

<h2>導入方法</h2>
1.Google Driveから <br>
　新規 → その他 → Google App Script
 
2.以下のコードを貼り付け
```
function myFunction() {
  const userProperties = PropertiesService.getScriptProperties();
  const username = userProperties.getProperty('学籍番号');
  const password = userProperties.getProperty('パスワード');
  const calendarId = userProperties.getProperty('メールアドレス');
  MoodleCalendar2.main(username, password, calendarId);
}
```

3.ライブラリを追加、以下のスクリプトIDを入力
```
1Az_5AZ-sRCEODFnwcX15iLZGQDumPuPnWUkAhM6M-iJ-O8lcGtR6OmIc
```

4.プロジェクトの設定（歯車マーク）→ スクリプトプロパティを編集

以下を入力<br>
プロパティ：学籍番号　　　　　値：<学籍番号を入力(s20t000)><br>
プロパティ：パスワード　　　　値：<パスワードを入力(学籍番号のパスワード)><br>
プロパティ：メールアドレス　　値：< Googleアカウント(XXXXX@gmail.com)を入力 > （別に用意したカレンダーIDでもOK）<br>
追加したらスクリプトプロパティを保存

5.エディタ（<>のマーク）に戻り実行を選択

6.認証が必要ですと出た場合は<br>
　権限を確認 → （自分のアカウントを選択）

「このアプリは Google で確認されていません」と出ますが<br>
   詳細 → 安全ではないページに移動 →　許可

　そのまま実行が完了します（ログに取得失敗と出た場合はプロパティと値が間違っていないか確認してください）

7.最後にトリガー（時計のマーク） → トリガーを追加

以下を設定<br>
イベントのソース：時間主導型<br>
時間ベースのトリガータイプ：日付ベースのタイマー<br>
時刻：（カレンダーを更新したい時間に設定）<br>
 → 保存する<br>
（補足：何分に実行するかの選択はありませんが保存した現在時刻の分がトリガーに適応されます。<br>
例：現在の時刻22時53分、トリガーを午後X時～Y時に設定した場合、実行される時刻はX時53分です。）

iOS、AndroidともにGoogleカレンダーをインストールしてもらえば利用できます。

※注意：教員によっては課題や出席の期限をmoodleのカレンダーに設定していない場合があります。

<h2>アップデート方法</h2>
1.Google Driveから自分のスクリプトを選択（名前を変更していなければ「無題のプロジェクト」です）

2.ライブラリのMoodleCalendar2を選択

3.バージョンをクリックし、最新のバージョンにする
