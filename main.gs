// メイン関数
function main (username, password) {
  Logger.log(`ユーザ名:${username}`);
  
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
  const triggers = ScriptApp.getProjectTriggers();
  const trigger0 = triggers[0].getUniqueId();
  const trigger1 = triggers[1].getUniqueId();

  const userProperties = PropertiesService.getUserProperties();
  const trigger00 = userProperties.getProperty('trigger0');
  const trigger11 = userProperties.getProperty('trigger1');

  if (triggers.length == 2 && ((trigger0 == trigger00 || trigger0 == trigger11) && (trigger1 == trigger11 || trigger1 ==  trigger00))) {
    const add = main(userProperties.getProperty('username'), userProperties.getProperty('password'));
    if (add === false) {
      Logger.log("アクセスエラー");
    } else {
      Logger.log(add);
    }
  } else {
    logout();
  }
}

// タグを抽出
function cheerio($, className, option, val) {
  const tmp = [];
  $(className).each((i, elem) => {  
    if      (option == 'attr') {tmp[i] = $(elem).attr(val)} 
    else if (option == 'text') {tmp[i] = $(elem).text()   }
    else                       {tmp[i] = $(elem).html()   }
  });
  return tmp;
}

// 文字列をパースする 
function parse(html, start, end) {
  return Parser.data(html).from(start).to(end).iterate(); // 配列 
}
function parse_one(html, start, end) {
  return Parser.data(html).from(start).to(end).build(); //単体
}