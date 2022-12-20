const START_TIME = -7;
const END_TIME = 31;

function calendar(eventsObj) {

  const myCalendarObj = search_calendar();

  if (myCalendarObj == null) {
    logout();
    return null;
  }

  const myEventsTitle = get_event(myCalendarObj);

  const addEventNumber = set_event(myCalendarObj, eventsObj, myEventsTitle);

  return addEventNumber;

  function search_calendar() {
    const userProperties = PropertiesService.getUserProperties();
    // カレンダーID
    const calendarId = userProperties.getProperty('calendarId');
  
    // カレンダーのオブジェクト取得
    return CalendarApp.getCalendarById(calendarId);
  }

  // Googleカレンダーのイベント情報を取得する
  function get_event(myCalendarObj) {
    // イベントの開始日
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + START_TIME);

    // イベントの終了日
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + END_TIME);

    // 開始日～終了日に存在するイベントを取得
    let myEventsObj = myCalendarObj.getEvents(startDate, endDate);
    if (myEventsObj == null) {return 0;}

    // カレンダーの内容だけを取得して配列に代入する
    let myEventsTitle = []
    for(let i = 0; i < myEventsObj.length; i++){
      myEventsTitle[i] = myEventsObj[i].getTitle();
    }
    return myEventsTitle;
  }

  // Googleカレンダーにイベントを追加
  function set_event(myCalendarObj, eventsObj, myEventsTitle) {
    let addEventNumber = 0;
    for (let i = 0; i < eventsObj.length; i++) {
      let flg = true;
      for (let j = 0; j < myEventsTitle.length; j++) {
        if (myEventsTitle[j].includes(eventsObj[i].id)) {
          flg = false;
          break;
        }
      } 
      if (flg) {
        create_event(eventsObj[i], myCalendarObj);
        addEventNumber++;
      }
    }
    return addEventNumber;

    function create_event(eventObj, myCalendarObj) {
      let title = eventObj.subjectTitle + '[' + eventObj.id + ']';

      // 時間を指定
      let startTime;
      switch (eventObj.classNum) {
        case 1: startTime = new Date(eventObj.eventtime.getFullYear(), eventObj.eventtime.getMonth(), eventObj.eventtime.getDate(),  8, 50, 0); break;
        case 2: startTime = new Date(eventObj.eventtime.getFullYear(), eventObj.eventtime.getMonth(), eventObj.eventtime.getDate(), 10, 30, 0); break;
        case 3: startTime = new Date(eventObj.eventtime.getFullYear(), eventObj.eventtime.getMonth(), eventObj.eventtime.getDate(), 13, 00, 0); break;
        case 4: startTime = new Date(eventObj.eventtime.getFullYear(), eventObj.eventtime.getMonth(), eventObj.eventtime.getDate(), 14, 40, 0); break;
        case 5: startTime = new Date(eventObj.eventtime.getFullYear(), eventObj.eventtime.getMonth(), eventObj.eventtime.getDate(), 16, 20, 0); break;
        default : startTime = eventObj.eventtime; break;
      }
      let endTime = eventObj.eventtime;

      // イベントの説明
      let options = {description: eventObj.content};

      // イベントを追加
      let newEvent = myCalendarObj.createEvent(title, startTime, endTime, options);

      // 追加したイベントの色を指定
      switch (eventObj.component) {
        case 'mod_assign'       : newEvent.setColor(11); break;
        case 'mod_attendance'   : newEvent.setColor(10); break;
        case 'mod_quiz'         : newEvent.setColor(5);  break;
        case 'mod_questionnaire': newEvent.setColor(8);  break;
        default                 : newEvent.setColor(7);  break;
      }
    }
  }
}