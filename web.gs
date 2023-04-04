// HTMLファイルの読み込み
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Kadai-Calendar');
}

// CSSファイルの読み込み
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


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
  if (userProperties.getProperty('auth')) {
    return -1;
  }
  if (moodle_login(username, password)) {
    userProperties.setProperty('username', username);
    userProperties.setProperty('password', password);
    userProperties.setProperty('auth', true);

    const name = `Kadai-Calendar[${username}]`;
    const options = {timeZone: "Asia/Tokyo", color: "#7cb342"};
    const calendar = CalendarApp.createCalendar(name, options);

    userProperties.setProperty('calendarId', calendar.getId());

    ScriptApp.newTrigger('auto_update_main').timeBased().everyHours(1).create();
    ScriptApp.newTrigger('logout').timeBased().atDate(2024, 3, 31).create();
    Logger.log(`学籍番号[${username}]登録完了`);
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
  Logger.log(`学籍番号[${userProperties.getProperty('username')}]登録解除`);
  const calendar = CalendarApp.getCalendarById(userProperties.getProperty('calendarId'));
  if (calendar) {
    calendar.deleteCalendar();
  }
  userProperties.deleteAllProperties();
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  return true
}