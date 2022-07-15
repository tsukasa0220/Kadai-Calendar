# MoodleCalender
GASを使ってGoogleカレンダーにMoodleの課題提出や出席登録の予定を追加

1.Google Driveから<br>
　新規 → その他 → Google App Script

2.以下のコードを貼り付け
```
function myFunction() {
  // スクリプトプロパティから学籍番号、パスワード、カレンダーIDを取得
  const userProperties = PropertiesService.getScriptProperties();
  const username = userProperties.getProperty('Username');
  const password = userProperties.getProperty('Password');
  const calenderId = userProperties.getProperty('CalenderID');
  moodle100.main(username, password, calenderId);
}
```

3.ライブラリを追加、以下のスクリプトIDを入力
```
1KOP3QLbYHcT9Kh9Iyronqt-FYIdg8XZwJ4aAMdASFC3CNjkkKVPc0z9V
```
バージョンは11でOK

4.サービスを追加、Google Calrender APIを選択

5.プロジェクトの設定（歯車マーク）→ スクリプトプロパティを編集

以下を入力<br>
プロパティ：Username　　値：<学籍番号を入力(s20t000)><br>
プロパティ：Password　　値：<パスワードを入力(学籍番号のパスワード)><br>
プロパティ：CalenderID　値：< Googleアカウント(XXXXX@gmail.com)を入力 > （別に用意したカレンダーIDでもOK）<br>
追加したらスクリプトプロパティを保存

6.エディタ（<>のマーク）に戻り実行を選択

7.認証が必要ですと出た場合は<br>
　権限を確認 → （自分のアカウントを選択）

「このアプリは Google で確認されていません」と出ますが<br>
   詳細 → 安全ではないページに移動 →　許可

　そのまま実行が完了します

8.最後にトリガー（時計のマーク） → トリガーを追加

以下を設定<br>
イベントのソース：時間主導型<br>
時間ベースのトリガータイプ：日付ベースのタイマー（推奨）<br>
時刻：（カレンダーを更新したい時間に設定）<br>
保存する<br>
（補足：何分に実行するかの選択はありませんが保存した現在時刻の分がトリガーに適応されます。<br>
例：現在の時刻22時53分、トリガーを午後X時～Y時に設定した場合、実行される時刻はX時53分です。）

iOS、AndroidともにGoogleカレンダーをインストールしてもらえば利用できます。