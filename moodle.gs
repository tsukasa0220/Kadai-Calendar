// Cookieのユーティリティクラス
class CookieUtil {
  // @param {string} cookie Cookieデータ（"name=value;...")
  // name == key なら return name=value;
  static getValue(cookies, key) {
    const cookiesArray = cookies.split(';');
    for(const c of cookiesArray){
      const cArray = c.split('=');
      if(cArray[0] == key){
        return `${cArray[0]}=${cArray[1]};`;
      }
    }
    return false;
  }
}

// moodleへのログイン処理
function moodle_login(username, password) {
  let response, cookies, data, $, headers, payload, options, moodleSession, sesskey;

  // ログインページを開く(GET) <200>
  headers = {
    'user-agent': USER_AGENT,
  }
  options = {
    'method': 'get',
    'headers': headers,
    'muteHttpExceptions': true,
    'validateHttpsCertificates' : false,
    'followRedirects' : false,
  }
  try {
    response = UrlFetchApp.fetch(LOGIN_URL, options);
  } catch(e) {
    Logger.log("Error:" + e);
    return false;
  }

  // ヘッダーから必要なcookieを取り出す
  cookies = response.getHeaders()["Set-Cookie"];
  moodleSession = CookieUtil.getValue(cookies, 'MoodleSession');
  if (moodleSession == false) {
    Logger.log("失敗[001]"); 
    return false;
  }

  // ページのソースからlogintokenを抽出
  data = response.getContentText("UTF-8");
  $ = Cheerio.load(data);
  const logintoken = $('[name="logintoken"]').val();

  Utilities.sleep(300);

  // ログインフォーム送信(POST) <303>
  headers = {
    'cookie': moodleSession,
    'user-agent': USER_AGENT,
  }
  payload = {
    'logintoken': logintoken,
    'username': username,
    'password': password,
  }
  options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
    'validateHttpsCertificates' : false,
    'followRedirects': false,
  }
  response = UrlFetchApp.fetch(LOGIN_URL, options);

  // MoodleSessionを取得し次のリクエストにセット
  // Set-cookieが複数あるため，キーが”MoodleSession”の値を取り出す
  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]
    if (CookieUtil.getValue(cookie, 'MoodleSession')) {
      moodleSession = CookieUtil.getValue(cookie, 'MoodleSession');
    }
  }
  if (moodleSession == false) {
    Logger.log("失敗[002]"); 
    return false;
  }

  Utilities.sleep(300);

  // 直近イベントのカレンダーのページ(GET) <200>
  headers = {
    'cookie': moodleSession,
    'user-agent': USER_AGENT,
  }
  options = {
    'method': 'get',
    'headers': headers,
    'validateHttpsCertificates' : false,
    'followRedirects': false,
  }
  response = UrlFetchApp.fetch(CALENDAR_URL, options);

　// 得られたレスポンスが、カレンダーのソースか[class=".eventlist"]で判断、ある場合はその入れ子であるHTMLソースを返す
  data = response.getContentText("UTF-8");
  $ = Cheerio.load(data);

  // ログアウトkeyを取得
  sesskey = parse_one(data, '"sesskey":"', '",');

  Utilities.sleep(300);

  // ログアウトする <303>
  headers = {
    'cookie': moodleSession,
    'user-agent': USER_AGENT,
  }
  payload = {
    'sesskey': sesskey,
  }
  options = {
    'method': 'get',
    'headers': headers,
    'payload': payload,
    'validateHttpsCertificates' : false,
    'followRedirects' : false,
  }
  response = UrlFetchApp.fetch(LOGOUT_URL, options);

  if ($('.eventlist').html()) {return $('.eventlist').html();} 
  Logger.log("取得失敗");
  return false;
}