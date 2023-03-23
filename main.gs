// メイン関数
function main (username, password) {
  Logger.log(`学籍番号:${username}`);
  
  // moodle.gsでログイン処理を行う
  const eventHtml = moodle_login(username, password);
  if (eventHtml == false) {return false;}

  // extrack.gsで取得した直近イベントのHTML文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  const eventsObj = extrack(eventHtml);
  if (eventsObj == null) {return 0;}

  // calendar.gsの処理
  const addEventNumber = calendar(eventsObj);
  return addEventNumber;
}

// カレンダー自動更新のための関数
function auto_update_main() {
  const userProperties = PropertiesService.getUserProperties();
  const add = main(userProperties.getProperty('username'), userProperties.getProperty('password'));
  if (add === false) {Logger.log("アクセスエラー");} 
  else {Logger.log(add);}
}