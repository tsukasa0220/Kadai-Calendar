// 1Mc8BthYthXx6CoIz90-JiSzSafVnT6U3t0z_W3hLTAX5ek4w0G_EIrNw
function extrack(event) {
  const eventArr = parse1(event, 'data-type="event"', 'class="card-link"');

  const id = parse1(event, 'data-event-id="', '"');
  let title = parse1(event, '<h3 class="name d-inline-block">', '</h3>');
  const due = parse1(event, '<a href="https://kadai-moodle.kagawa-u.ac.jp/calendar/view.php?view=day&amp;time=', '">');
  let subject = parse1(event, '<div class="col-11"><a href="https://kadai-moodle.kagawa-u.ac.jp/course/view.php?id=', '</a></div>');
  let url = parse1(event, '<div class="card-footer text-right bg-transparent">\n                            ', '" class="card-link">');  
  let description = [''];
  for (let i = 0; i < eventArr.length; i++) {
    if (eventArr[i].includes('<div class="description-content col-11">')) {
      description[i] = parse2(eventArr[i], '<div class="description-content col-11">', '</div>');
    } else {
      description[i] = 'お知らせはありません';
    }
  }

  let lors = [""];
  const content = [""];
  const color = [];
  const subjectTitle = [""];
  for (let i = 0; i < id.length; i++) {
    //取得したurlを利用して、includesで分類（提出、出席、小テスト等）とurlを作成
    lors[i] = '期限';
    if (url[i].includes("assign")) { 　　　　　　　　　　　　　　　　　　　　　　　//課題
      color[i] = 11;
      url[i] = url[i] + '" class="card-link">提出物をアップロードする</a>';
      subjectTitle[i] = "課題：" + subject[i].slice(6);
    } else if (url[i].includes("attendance")) { 　　　　　　　　　　　　　　　　//出席
      color[i] = 2;
      url[i] = url[i] + '" class="card-link">出席登録を行う</a>';
      subjectTitle[i] = "出席：" + subject[i].slice(6);
      if (subject[i].includes(description[i])) {
        title[i] = description[i];
      } else {
        title[i] = subject[i].slice(6);
      }
    } else if (url[i].includes("quiz")) { 　　　　　　　　　　　　　　　　　　　　//小テスト
      color[i] = 5;
      url[i] = url[i] + '" class="card-link">小テストを受験する</a>';
      subjectTitle[i] = "小テスト：" + subject[i].slice(6);
      if (title[i].includes("開始")) {lors[i] = "開始"} 
    } else if (url[i].includes("questionnaire")) { 　　　　　　　　　　　　　　　//アンケート
      color[i] = 8;
      url[i] = url[i] + '" class="card-link">アンケートに回答する</a>';
      subjectTitle[i] = "アンケート：" + subject[i].slice(6);
    } else { 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　//その他（amsplayer,chatなど）
      color[i] = 7;
      url[i] = url[i] + '" class="card-link">活動に移動する</a>'
      subjectTitle[i] = "活動：" + subject[i].slice(6);
    }
    //時間割名にURLを付与
    subject[i] = '<a href="https://kadai-moodle.kagawa-u.ac.jp/course/view.php?id=' + subject[i] + '</a>';

    //本文を１つに統合
    content[i] = conbibe(title[i], url[i], subject[i], description[i], due[i], lors[i]);
  }
  return [id, subjectTitle, content, due, color];
}

//文字列をパースする
function parse1(html, start, end) {
  return Parser.data(html).from(start).to(end).iterate();
}
function parse2(html, start, end) {
  return Parser.data(html).from(start).to(end).build();
}

//時間を{yyyy年mm月dd日(day of week)hh時mm分ss秒}に変換
function timeChange(dateObj){
  let text = '';

  let aryWeek = ['日', '月', '火', '水', '木', '金', '土'];

  text = dateObj.getFullYear() + '年' + //年の取得
        (dateObj.getMonth() + 1) + '月' + //月の取得 ※0~11で取得になるため+1
        dateObj.getDate() + '日' + //日付の取得
        '(' + aryWeek[dateObj.getDay()] + ')' + //曜日の取得 0~6で取得になるため事前に配列で設定
        dateObj.getHours() + '時' + //時間の取得
        dateObj.getMinutes() + '分' /*+ //分の取得
        dateObj.getSeconds() + '秒'*/; //秒の取得（未使用）

  return text;
}

function conbibe(title, url, subject, description, due, lors) {
  return "==============\n" + 
         "Moodleカレンダー\n" + 
         "==============\n" + 
         "\n" + 
         "★" + url + "\n" + 
         "\n" + 
         "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + 
         "\n" + 
         "■時間割名：" + subject + "\n" + 
         "\n" + 
         "■" + lors + "：" + timeChange(new Date(due * 1000)).slice(5) + "\n" + 
         "\n" + 
         "■更新日時：" + timeChange(new Date())　+ "\n" + 
         "\n" + 
         "■概要" + "\n" +
         "\n" +  
         title + "\n" +
         "\n" +  
         "■本文" + "\n" + 
         "\n" + 
         description + "\n" + 
         "\n" + 
         "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + 
         "\n" + 
         "万一、このシステムによる利用者の不手際が発生しても、一切保証を負えませんのでご了承ください。\n" + 
         '詳細については<a href="https://github.com/tsukasa0220/MoodleCalender">こちら</a>から'
}