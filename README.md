# MoodleCalendar
GASを使ってGoogleカレンダーにMoodleの課題提出や出席登録の予定を追加
<h2>注意事項</h2>
万一、このシステムによって利用者の不手際が発生しても一切保証を負えませんのでご了承ください。 <br>
課題や出席の情報はカレンダーの直近イベントから取得しています。 <br>
カレンダーが上手く表示されない場合は<a href="https://kadai-moodle.kagawa-u.ac.jp/user/calendar.php">こちら</a>から直近イベントの設定を確認してください。 <br>
また、教員によっては課題や出席の期限をMoodleのカレンダーに設定していない場合があります。 <br>

<h2>導入方法</h2>
1.<a href="https://drive.google.com/drive/my-drive">Google Drive</a>から <br>
　新規 → その他 → Google App Script <br>
<br>

2.以下のコードを貼り付け（もともとあるコードは消してください。）
```
function myFunction() {
  const userProperties = PropertiesService.getScriptProperties();
  const username = userProperties.getProperty('学籍番号');
  const password = userProperties.getProperty('パスワード');
  const calendarId = userProperties.getProperty('メールアドレス');
  MoodleCalendar2.main(username, password, calendarId);
}
```
<br>

3.ライブラリを追加、以下のスクリプトIDを入力して保存
```
1Az_5AZ-sRCEODFnwcX15iLZGQDumPuPnWUkAhM6M-iJ-O8lcGtR6OmIc
```
<br>
4.プロジェクトの設定（歯車マーク）→ スクリプトプロパティを編集 <br>
以下を入力 
<table border="1">
　<tr>
　　<th>プロパティ</th>
　　<th>値</th>
　</tr>
　<tr>
　　<td>学籍番号</td>
　　<td>＜s付きの学籍番号（s20t000）＞</td>
　</tr>
　<tr>
　　<td>パスワード</td>
　　<td>＜学籍番号のパスワード＞</td>
　</tr>
 <tr>
　　<td>メールアドレス</td>
　　<td>＜Googleアカウント（XXXX@gmail.com）＞</td>
　</tr>
</table>
（補足：メールアドレスの値はカレンダーIDでもOKです。） <br>
追加したらスクリプトプロパティを保存 <br>
<br>
5.エディタ（<>のマーク）に戻り"実行"を選択 <br>
認証が必要ですと出た場合は、権限を確認 → （自分のアカウントを選択） <br>
「このアプリは Google で確認されていません」と出ますが、詳細 → 安全ではないページに移動 → 許可 <br>
そのまま実行が完了します。（ログに"取得失敗"と出た場合はプロパティと値が間違っていないか確認してください。） <br>
<br>
6.トリガー（時計のマーク） → トリガーを追加 <br>
以下を設定 
<table border="1">
　<tr>
　　<td>実行する関数を選択</td>
　　<td>myFunction</td>
　</tr>
　<tr>
　　<td>実行するデプロイを選択</td>
　　<td>Head</td>
　</tr>
　<tr>
　　<td>イベントのソースを選択</td>
　　<td>時間主導型</td>
　</tr>
 <tr>
　　<td>時間ベースのトリガーのタイプを選択</td>
　　<td>日付ベースのタイマー（推奨）</td>
　</tr>
  <tr>
　　<td>時刻を選択</td>
　　<td>＜カレンダーの情報を更新したい時刻を選択＞</td>
　</tr>
</table>
設定が完了したら保存 <br>
（補足：何分に実行するかの選択はありませんが保存した現在時刻の分がトリガーに適応されます。 <br>
例：現在の時刻22時53分、トリガーを午後X時～Y時に設定した場合、実行される時刻はX時53分です。） <br>
<br>
以上で導入完了です。
iOS、AndroidともにGoogleカレンダーをインストールしてもらえば利用できます。 <br>
通知はGoogleカレンダーの設定から予定 → デフォルトの通知から変更できます。（機種によって異なる場合があります。）<br>
<h2>アップデート方法</h2>
最新バージョンが公開されると、カレンダー上部に「最新のバージョンがあります！！」と表示されます。 <br>
以下の手順でバージョンアップをお願いします。 <br>
<br>
1.<a href="https://drive.google.com/drive/my-drive">Google Drive</a>から自分のスクリプトを選択（名前を変更していなければ「無題のプロジェクト」です。） <br>
<br>
2.ライブラリのMoodleCalendar2をクリック（点３つのところではなく、そのままクリックしてください。） <br>
<br>
3.バージョンをクリックし、最新のバージョンにする。 <br>
<h3>バージョン2.2</h3>
moodle.gsのユーザーエージェントを更新しました。 <br>
<h3>バージョン2.3</h3>
虚無イベントが追加されるバグを修正 <br>
<h3>バージョン2.4予定</h3>
moodle.gsをリファクタリングして処理を軽くしました。 <br>
<h3>現在確認しているバグ</h3>
直近イベントが１つもない場合に処理を行うと、誤って1970年1月1日に虚無イベントが追加されてしまうバグがあります。 <br>
そのままでも普段通り利用できますが、気になる方は新しくバージョンを公開しているため更新しておいてください。 <br>
また、追加されてしまった予定は手動で消していただくか、Ver2.4で削除機能を追加します。
