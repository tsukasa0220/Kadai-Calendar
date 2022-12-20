// サイトをひらいたときの処理
function doGet() {
  const userProperties = PropertiesService.getUserProperties();
  let website = 'login_before';
  if (userProperties.getProperty('auth')) {
    website = 'login_after';
  }
  return HtmlService.createTemplateFromFile(website).evaluate().setTitle('Kadai-Calendar');
}

// CSS用
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function onload() {
  const userProperties = PropertiesService.getUserProperties();
  return [userProperties.getProperty('username'), userProperties.getProperty('calendarId')];
}

// サイト内処理
function setup(username, password) {
  const userProperties = PropertiesService.getUserProperties();
  if (userProperties.getProperty('auth')) {
    return -1;
  }
  if (login(username, password)) {
    userProperties.setProperty('username', username);
    userProperties.setProperty('password', password);
    userProperties.setProperty('auth', true);

    const name = `Kadai-Calendar[${username}]`;
    const options = {timeZone: "Asia/Tokyo", color: "#7cb342"};
    const calendar = CalendarApp.createCalendar(name, options);

    userProperties.setProperty('calendarId', calendar.getId());

    ScriptApp.newTrigger('auto_update_main').timeBased().everyHours(1).create();
    ScriptApp.newTrigger('logout').timeBased().atDate(2023, 3, 31).create();
    return true;
  } else {
    return false;
  }
}

function update_calendar() {
  const userProperties = PropertiesService.getUserProperties();
  if (!userProperties.getProperty('auth')) {return [-1, -1]}
  const username = userProperties.getProperty('username');
  const password = userProperties.getProperty('password');
  return [main(username, password), userProperties.getProperty('calendarId')];
}

function logout() {
  const userProperties = PropertiesService.getUserProperties();
  if (!userProperties.getProperty('auth')) {return -1}
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