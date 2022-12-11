// Googleカレンダーのイベント情報を取得する
function getCalendarEvent(user) {
  // アクセス可能なカレンダーのIDを指定して、Googleカレンダーを取得

  const name = `香川大学Moodleカレンダー[${user}]`;
  const options = {
    timeZone: "Asia/Tokyo",
    color: "#7cb342"
    };

  let myCalendars = CalendarApp.getCalendarsByName(name);

  if (myCalendars[0] == null) {
    CalendarApp.createCalendar(name, options);
    myCalendars = CalendarApp.getCalendarsByName(name);
    if (DEBUG) {Logger.log("処理中：カレンダーを新しく作成します")}
  }

  let myCalendar = myCalendars[0];
  
  // イベントの開始日(-7)
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // イベントの終了日(+31)
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 31);

  // 開始日～終了日に存在するイベントを取得
  let myEvent = myCalendar.getEvents(startDate, endDate);
  if (!myEvent) {return 0;}
  
  // カレンダーの内容だけを取得して配列に代入する
  let myTitle = []
  for(let i = 0 ; i < myEvent.length ; i++ ){
    myTitle[i] = myEvent[i].getTitle();
  }
  return myTitle;
}

// Googleカレンダーにイベントを追加
function createEvent(event, user) {
  // 指定したgoogleカレンダーのIDを取得
  let calendars = CalendarApp.getCalendarsByName(`香川大学Moodleカレンダー[${user}]`);
  let calendar = calendars[0];

  // タイトルを指定
  let title = event.subjectTitle + '[ID:' + event.id + ']';

  // 時間を指定
  let startTime;
  switch (event.classNum) {
    case 1: startTime = new Date(event.eventtime.getFullYear(), event.eventtime.getMonth(), event.eventtime.getDate(),  8, 50, 0); break;
    case 2: startTime = new Date(event.eventtime.getFullYear(), event.eventtime.getMonth(), event.eventtime.getDate(), 10, 30, 0); break;
    case 3: startTime = new Date(event.eventtime.getFullYear(), event.eventtime.getMonth(), event.eventtime.getDate(), 13, 00, 0); break;
    case 4: startTime = new Date(event.eventtime.getFullYear(), event.eventtime.getMonth(), event.eventtime.getDate(), 14, 40, 0); break;
    case 5: startTime = new Date(event.eventtime.getFullYear(), event.eventtime.getMonth(), event.eventtime.getDate(), 16, 20, 0); break;
    default : startTime = event.eventtime; break;
  }
  let endTime = event.eventtime;

  // イベントの説明
  let options = {description: event.content}

  // イベントを追加
  let newEvent = calendar.createEvent(title, startTime, endTime, options);

  // 追加したイベントの色を指定
  switch (event.component) {
    case 'mod_assign'       : newEvent.setColor(11); break;
    case 'mod_attendance'   : newEvent.setColor(10); break;
    case 'mod_quiz'         : newEvent.setColor(5);  break;
    case 'mod_questionnaire': newEvent.setColor(8);  break;
    default                 : newEvent.setColor(7);  break;
  }
}