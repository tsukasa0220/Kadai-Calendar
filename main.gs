// Cheerio: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
// Parser : 1Mc8BthYthXx6CoIz90-JiSzSafVnT6U3t0z_W3hLTAX5ek4w0G_EIrNw

const VERSION = '0.9.0';

function main (username, password) {
  // moodle.gsでログイン処理を行う
  const eventHtml = login(username, password);
  if (eventHtml == false) {return false;}

  // extrack.gsで取得した直近イベントのHTML文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  const eventsObj = extrack(eventHtml);
  if (eventsObj == null) {return 0;}

  // calendar.gsの処理
  const addEventNumber = calendar(eventsObj);
  return addEventNumber;
}

function auto_update_main() {
  const userProperties = PropertiesService.getUserProperties();
  const add = main(userProperties.getProperty('username'), userProperties.getProperty('password'));
  console.log(add);
}