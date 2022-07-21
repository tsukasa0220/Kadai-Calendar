//※スクリプト名の変更厳禁
const DEBUG = false;
const VERSION = 1;

function main (username, password, calenderId) {
  if (DEBUG) {console.log(username + "\n" + password + "\n" + calenderId + "\n");}

  //moodleの直近のイベントからHTMLを取得
  console.log("HTMLの取得中");
  const html = login(username, password);
  const event = parse2(html, 'class="current text-center"', 'class="singlebutton"');

  if (event.includes("<!DOCTYPE html>")) {
    console.log("HTMLの取得失敗");
    return 0;
  }
  console.log("HTMLの取得成功");
  
  //取得したHTMLの文字列をパースしてID、タイトル、期限、科目、URL（共通部分は除去）を抜き出す
  console.log("HTMLを解析・抽出中")
  const [id, title, content, due, color] = extrack(event);
  if (DEBUG) {console.log(id + "\n" + title + "\n" + due + "\n" + color)}
  console.log("HTMLの解析・抽出完了");

  console.log("カレンダーに追加中");
  //香大moodleカレンダーのタイトルを取得
  const myTitle = getCalenderEvent(calenderId);
  if (DEBUG) {console.log(myTitle)}
  //香大moodleのカレンダーとHTMLから取得したタイトル（IDで判別）が重複している場合はスキップ、していない場合は香大moodleカレンダーに追加
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
      createEvent(calenderId ,id[i], title[i], content[i], due[i], color[i]);
      if (DEBUG) {console.log("追加" + (i + 1))}
    }
  }
  console.log("追加完了");
}
