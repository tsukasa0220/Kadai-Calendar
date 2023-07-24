// メイン関数
function calendar(eventsObj) {
  // Kadai-Calendar[s20t000]をGoogleカレンダーのリストから探索
  const myCalendarObj = search_calendar();

  // Kadai-Calendar[s20t000]がなければKadai-Calendarの登録を強制解除
  if (myCalendarObj == null) {
    logout();
    return null;
  }
  
  // Kadai-Calendar[s20t000]内にあるイベントを取得
  const myEventsObj = get_event(myCalendarObj);

  // Kadai-Calendar[s20t000]に新しいイベント追加, 追加したイベントの数を返却
  const addEventNumber = set_event(myCalendarObj, eventsObj, myEventsObj);
  return addEventNumber;

  // Kadai-Calendar[s20t000]をGoogleカレンダーのリストから探索
  function search_calendar() {
    // ユーザプロパティ
    const userProperties = PropertiesService.getUserProperties();
    
    // ユーザプロパティからカレンダーIDを取得
    const calendarId = userProperties.getProperty('calendarId');
  
    // カレンダーIDからKadai-Calendar[s20t000]のイベントのオブジェクト取得
    return CalendarApp.getCalendarById(calendarId);
  }

  // Kadai-Calendar[s20t000]内にあるイベントを取得
  function get_event(myCalendarObj) {
    // スクリプトプロパティの取得
    let scriptProperties = PropertiesService.getScriptProperties();
    let time_start = parseInt(scriptProperties.getProperty('GOOGLE_CALENDAR_TIME_START'));
    let time_end   = parseInt(scriptProperties.getProperty('GOOGLE_CALENDAR_TIME_END'));

    // イベントの開始日の範囲を指定（現在＋START_TIME）
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + time_start);

    // イベントの終了日の範囲を指定（現在＋END_TIME）
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + time_end);

    // 開始日～終了日の範囲に存在するイベントを取得
    let myEventsObj = myCalendarObj.getEvents(startDate, endDate);
    if (myEventsObj == null) {return 0;}

    return myEventsObj;
  }

  // Kadai-Calendar[s20t000]に新しいイベント追加, 追加したイベントの数を返却
  function set_event(myCalendarObj, eventsObj, myEventsObj) {
    let addEventNumber = 0;
    let maxDate = new Date();
    for (let i = 0; i < eventsObj.length; i++) {
      let flg = true;
      for (let j = 0; j < myEventsObj.length; j++) {
        if (myEventsObj[j].getTitle().includes(eventsObj[i].id)) {
          if (myEventsObj[j].getEndTime().getFullYear() == eventsObj[i].eventtime.getFullYear() &&
              myEventsObj[j].getEndTime().getMonth()    == eventsObj[i].eventtime.getMonth()    &&
              myEventsObj[j].getEndTime().getDay()      == eventsObj[i].eventtime.getDay()      &&
              myEventsObj[j].getEndTime().getHours()    == eventsObj[i].eventtime.getHours()    &&
              myEventsObj[j].getEndTime().getMinutes()  == eventsObj[i].eventtime.getMinutes()    ) {flg = false;} 
          else                                                                                      {myEventsObj[j].deleteEvent();}  
        }
      } 
      if (flg) {
        create_event(eventsObj[i], myCalendarObj);
        addEventNumber++;
      }
      if (eventsObj[i].eventtime > maxDate) {
        maxDate = eventsObj[i].eventtime;
      }
    }
    delete_event(eventsObj, myEventsObj, maxDate);
    return addEventNumber;

    function delete_event(eventsObj, myEventsObj, maxDate) {
      let flg = true;
      for (let i = 0; i < myEventsObj.length; i++) {
        for (let j = 0; j < eventsObj.length; j++) {
          if (myEventsObj[i].getEndTime() < new Date() || myEventsObj[i].getTitle().includes(eventsObj[j].id) || myEventsObj[i].getEndTime() > maxDate) {
            flg = false;
          }
        }
        if (flg) {
          myEventsObj[i].deleteEvent();
        }
        flg = true;
      }
    }

    function create_event(eventObj, myCalendarObj) {
      let title = eventObj.subjectTitle + `[${eventObj.id}]`;

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

      // 追加スキップ
      if (eventObj.component == 'mod_attendance' && startTime == endTime) {
        return 0;
      }

      // イベントを追加
      let newEvent = myCalendarObj.createEvent(title, startTime, endTime, options);

      // 追加したイベントの色を指定
      switch (eventObj.component) {
        case 'mod_assign'       : newEvent.setColor(11); break;
        case 'mod_attendance'   : newEvent.setColor(10); break;
        case 'mod_quiz'         : newEvent.setColor(5);  break;
        case 'mod_questionnaire': newEvent.setColor(8);  break;
        case 'mod_choice'       : newEvent.setColor(9);  break;
        default                 : newEvent.setColor(7);  break;
      }
    }
  }
}