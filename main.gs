function main (username, password) {
  // moodle.gsでログイン処理を行う
  const eventHtml = moodle_login(username, password);
  if (eventHtml == false) {return false;}

  // extrack.gsで取得した直近イベントのHTML文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  const eventsObj = extrack(eventHtml);
  if (eventsObj == null) {return -1;}

  // calendar.gsの処理
  const addEventNumber = calendar(eventsObj);
  return addEventNumber;
}

// 変更注意
function auto_update_main() {
  const userProperties = PropertiesService.getUserProperties();
  const add = main(userProperties.getProperty('username'), userProperties.getProperty('password'));
  if (add == -1) {
    Logger.log(0);
  }
  else if (add == false) {
    Logger.log("アクセスエラー");
  } else {
    Logger.log(add);
  }
}