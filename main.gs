// Cheerio: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0

const DEBUG = 0;
const VERSION = 4;

function main (username, password, calendarId) {
  // DEBUG:アカウント情報を表示
  if (DEBUG) {console.log(username + "\n" + password + "\n" + calendarId + "\n");}

  //1
  console.log("ソースを取得中");
  // moodle.gsでログイン処理を行う
  const html = login(username, password);
  if (html == false) {return 0;}

  // 取得したデータから直近イベントをパース
  const event = parse2(html, 'class="current text-center"', 'class="singlebutton"');

  //パースに失敗した場合は終了
  if (event.includes("<!DOCTYPE html>")) {
    console.log("ソースの取得失敗");
    return 0;
  }
  console.log("ソースの取得成功");
  
  //2
  console.log("ソースを解析・抽出中");
  // extrack.gsで取得した直近イベントのHTML文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  let [id, title, content, due, color] = extrack(event);
  if (DEBUG) {console.log(id);}
  if (id.toString().includes("div")) {console.log("イベントなし"); return 0;}

  //DEBUG:イベントの情報を表示
  console.log("ソースの解析・抽出完了");

  //3
  console.log("Googleカレンダーに追加中");
  // googleカレンダーのタイトルを取得
  const myTitle = getCalendarEvent(calendarId);

  // DEBUG:googleカレンダーのイベントを表示
  if (DEBUG) {console.log(myTitle)}

  // googleカレンダーのイベントとHTMLから取得したイベントのタイトル([ID:00000])が重複している場合はスキップ、していない場合はgoogleカレンダーに追加
  for (let i = 0; i < id.length; i++) {
    let tmp = 1;
    for (let j = 0; j < myTitle.length; j++) {
      if (myTitle[j].includes(id[i])) {
        tmp = 0;
        if (DEBUG) {console.log("skip")}
        break;
      }
    }
    if (tmp) {
      createEvent(calendarId ,id[i], title[i], content[i], due[i], color[i]);
      if (DEBUG) {console.log("追加" + (i + 1))}
    }
  }
  console.log("Googleカレンダーに追加完了");
}
        break;
      }
    }
    if (tmp) {
      createEvent(calenderId ,id[i], title[i], content[i], due[i], color[i]);
      if (DEBUG) {console.log("追加" + (i + 1))}
    }
  }
  console.log("追加完了");
}
