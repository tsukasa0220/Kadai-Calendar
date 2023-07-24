// HTMLファイルの読み込み
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("Kadai-Calendar(GAS)");
}

// CSSファイルの読み込み
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// 利用者のデータ読み込み
function onload() {
  const userProperties = PropertiesService.getUserProperties();
  if (userProperties.getProperty('auth')) {
    return [true, userProperties.getProperty('username')];
  }
  return false;
}

// 登録処理
function login(username, password) {
  const userProperties = PropertiesService.getUserProperties();
  // 二重登録の回避
  if (userProperties.getProperty('auth')) {return -1;}

  // ログイン処理の判定
  if (moodle_login(username, password)) {
    userProperties.setProperty('username', username);
    userProperties.setProperty('password', password);
    userProperties.setProperty('auth', true);
    
    // 作成するcalendarの名前
    const name = `Kadai-Calendar2023[${username}]`;
    const options = {timeZone: "Asia/Tokyo", color: "#7cb342"};
    const calendar = CalendarApp.createCalendar(name, options);
    userProperties.setProperty('calendarId', calendar.getId());

    // 新しいトリガーの設定
    ScriptApp.newTrigger('logout').timeBased().atDate(2024, 3, 31).create();
    ScriptApp.newTrigger('auto_update_main').timeBased().everyHours(1).create();
    const triggers = ScriptApp.getProjectTriggers();
    userProperties.setProperty('trigger0', triggers[0].getUniqueId());
    userProperties.setProperty('trigger1', triggers[1].getUniqueId());
    Logger.log(`ユーザ名[${username}]登録`);
    return true;
  } else {
    return false;
  }
}

// カレンダーの更新処理
function update_calendar() {
  const userProperties = PropertiesService.getUserProperties();
  if (!userProperties.getProperty('auth')) {return [-1, -1]}
  const username = userProperties.getProperty('username');
  const password = userProperties.getProperty('password');
  return [main(username, password), userProperties.getProperty('calendarId')];
}

// 登録解除処理
function logout() {
  const userProperties = PropertiesService.getUserProperties();
  if (!userProperties.getProperty('auth')) {return -1}
  Logger.log(`ユーザ名[${userProperties.getProperty('username')}]登録解除`);
  const calendar = CalendarApp.getCalendarById(userProperties.getProperty('calendarId'));
  if (calendar) {
    calendar.deleteCalendar();
  }
  userProperties.deleteAllProperties();
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  return true;
}