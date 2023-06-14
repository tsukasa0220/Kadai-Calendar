// メイン関数
function extrack(eventHtml) {
  // eventHtmlをCheeioに渡す
  const $eventLists = Cheerio.load(eventHtml);

  // 直近のイベントを[class="calendar-no-results"]で判別し、ない場合は全て0で返す
  if ($eventLists('.calendar-no-results').html()) {return null;}

  // Cheerioで情報を抽出
  const id        = cheerio($eventLists, '.event'    , 'attr', 'data-event-id'       ); // ID
  const title     = cheerio($eventLists, '.event'    , 'attr', 'data-event-title'    ); // タイトル
  const component = cheerio($eventLists, '.event'    , 'attr', 'data-event-component'); // イベントの種類（リンク用）
  const eventtype = cheerio($eventLists, '.event'    , 'attr', 'data-event-eventtype'); // イベントの種類（時間用）
  const courseid  = cheerio($eventLists, '.event'    , 'attr', 'data-course-id'      ); // コースID
  const eventlink = cheerio($eventLists, '.card-link', 'attr', 'href'                ); // リンク
  const unixtime  = parse(eventHtml, '"https://kadai-moodle.kagawa-u.ac.jp/calendar/view.php?view=day&amp;time=', '"'); // unix時間
  
  const description  = [];
  const subject      = [];
  const content      = [];
  const subjectTitle = [];
  const eventtime    = [];
  const classNum     = [];
  
  eventHtml = cheerio($eventLists, '.event', 'html', null);

  const event = [];

  for (let i = 0; i < id.length; i++) {
    eventtime[i]   = new Date(unixtime[i] * 1000);
    description[i] = cheerio(Cheerio.load(eventHtml[i]), '.description-content',                                                           'html', null);
    subject[i]     = cheerio(Cheerio.load(eventHtml[i]), `[href="https://kadai-moodle.kagawa-u.ac.jp/course/view.php?id=${courseid[i]}"]`, 'text', null);

    switch (component[i]) {
      case 'mod_assign'       : subjectTitle[i] = "課題：" + subject[i];       break;
      case 'mod_attendance'   : subjectTitle[i] = "出席：" + subject[i];
                                classNum[i] = start_attendance(eventtime[i]); break;
      case 'mod_questionnaire': subjectTitle[i] = "アンケート：" + subject[i];  break;
      case 'mod_quiz'         : subjectTitle[i] = "テスト：" + subject[i];     break;
      case 'mod_choice'       : subjectTitle[i] = "投票：" + subject[i];       break;
      default                 : subjectTitle[i] = "活動：" + subject[i];       break;
    }

    // １つに統合
    content[i] = conbine(title[i], component[i], eventtype[i], courseid[i], eventlink[i], description[i], eventtime[i], subject[i]);

    // オブジェクト化 
    event[i] = {id: id[i], subjectTitle: subjectTitle[i], eventtime: eventtime[i], classNum: classNum[i], component: component[i], content: content[i]};
  }
  return event;

  // 出席する時間を何時間目で返す
  function  start_attendance(dateObj) {
    const timeMinute = dateObj.getHours() * 60 + dateObj.getMinutes();
    if      (timeMinute <= 630)  {return 1;} 
    else if (timeMinute <= 730)  {return 2;}
    else if (timeMinute <= 880)  {return 3;} 
    else if (timeMinute <= 980)  {return 4;} 
    else if (timeMinute <= 1080) {return 5;} 
    else{return 0;}
  }
}

// １つに統合
function conbine(title, component, eventtype, courseid, eventlink, description, eventtime, subject) {
  return `<h2><font color="darkorange">Kadai-Calendar </font><font color="#9acd32">Ver${version()}</font></h2><br>` + 
         `<h4><font color="#9acd32">★</font> <font color="#ff8c00">${event_link(component, eventlink)}</font></h4><br>` + 
         `<b><font color="#add8e6">============================</font></b><br>` + 
         `<font color="#9acd32">■</font>${event_type(eventtype)}：${time_change(eventtime)}<br>` + 
         `<font color="#9acd32">■</font>時間割名：<font color="#ff8c00"><a href="https://kadai-moodle.kagawa-u.ac.jp/course/view.php?id=${courseid}">${subject}</a></font><br>` +
         `<font color="#9acd32">■</font>概要<br>` + 
         `${title}<br>` + 
         `${descript_orNull(description)}<br>` + 
         `<font color="#9acd32">■</font>更新日時：${time_change(new Date())}<br>` + 
         `<b><font color="#add8e6">============================</font></b><br>` +
         `<font color="#9acd32">●</font>Webアプリ：<font color="#ff8c00"><a href="https://kadai-calendar.com">Kadai-Calendar</a></font><br>` + 
         `${notice()}`;

  // バージョン
  function version() {
    let scriptProperties = PropertiesService.getScriptProperties();
    return scriptProperties.getProperty('VERSION');
  }

  // お知らせ
  function notice() {
    let scriptProperties = PropertiesService.getScriptProperties();
    if (scriptProperties.getProperty('NOTICE')) {
      return `<font color="#9acd32">●</font>お知らせ<br>${scriptProperties.getProperty('NOTICE')}`;
    }
    return '';
    
  }

  // dateObjを{mm月dd日(day of week)hh時mm分}に変換
  function  time_change(dateObj){
    let text = '';
    let aryWeek = ['日', '月', '火', '水', '木', '金', '土'];
    text = /*dateObj.getFullYear() + '年' + */ 
        (dateObj.getMonth() + 1) + '月' + 
        dateObj.getDate() + '日' + 
        '(' + aryWeek[dateObj.getDay()] + ')' + 
        dateObj.getHours() + '時' + 
        dateObj.getMinutes() + '分' /*+ 
        dateObj.getSeconds() + '秒'*/; 
    return text;
  }

  // 本文があるかないか判別
  function descript_orNull(description) {
    let text = "";
    if (String(description)) {text = `<br><font color="#9acd32">■</font>本文(プレビュー版)<br>${description}<br>`}
    return text;
  }

  // イベントの種類（時間用）を日本語化
  function event_type (eventtype) {
    switch (eventtype) {
      case 'open'       : return "開始日時";
      case 'close'      : return "終了日時";
      case 'due'        : return "提出期限";
      case 'attendance' : return "出席期限";
      default           : return "活動日時";
    }
  }

  // 活動先のリンク先を作成
  function event_link (component, eventlink) {
    switch (component) {
      case ''                 : return 'o(*^▽^*)o わーい';
      case 'mod_assign'       : return `<a href="${eventlink}">提出物をアップロードする</a>`;
      case 'mod_attendance'   : return `<a href="${eventlink}">出席登録を行う</a>`;
      case 'mod_questionnaire': return `<a href="${eventlink}">アンケートに回答する</a>`;
      case 'mod_quiz'         : return `<a href="${eventlink}">テストを受験する</a>`;
      case 'mod_choice'       : return `<a href="${eventlink}">投票を行う</a>`;
      default                 : return `<a href="${eventlink}">活動に移動する</a>`;
    }
  }
}