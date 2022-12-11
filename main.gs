// Cheerio: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
// Parser : 1Mc8BthYthXx6CoIz90-JiSzSafVnT6U3t0z_W3hLTAX5ek4w0G_EIrNw

const DEBUG = false;
const VERSION = 0;

function main (user, password) {
  // DEBUG
  if (DEBUG) {Logger.log("デバッグ情報：オン");}

  // ユーザプロパティの確認
  if (user == null || password == null) {return 0;}

  // DEBUG:アカウント情報を表示
  if (DEBUG) {Logger.log("デバッグ情報：\n学籍番号" + user + "\nパスワード" + password);}

  // moodle.gsでログイン処理を行う
  const eventHtml = login(user, password);
  if (eventHtml == false) {return 0;}

  // DEBUG:eventHtmlのソースを表示
  if (DEBUG) {Logger.log(eventHtml);}

  // extrack.gsで取得した直近イベントのHTML文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  const event = extrack(eventHtml);
  if (event == null) {return 0;}

  // イベントの情報を表示
  if (DEBUG) {Logger.log("デバッグ情報：イベントのオブジェクト\n" + event);}

  // calender.gsでGoogleカレンダーのイベント情報（タイトル）を取得
  const myTitle = getCalendarEvent(user);

  // DEBUG:googleカレンダーのイベントを表示
  if (DEBUG) {Logger.log("デバッグ情報：取得したイベントのタイトル\n" + myTitle);}

  // googleカレンダーのイベントとHTMLから取得したイベントのタイトル([ID:XXXXX])が重複している場合はスキップ、していない場合はgoogleカレンダーに追加  
  for (let i = 0; i < event.length; i++) {
    let flg = true;
    for (let j = 0; j < myTitle.length; j++) {
      if (myTitle[j].includes(event[i].id)) {
        flg = false;
        break;
      }
    }
    if (flg) {createEvent(event[i], user)}
  }
  return 0;
}