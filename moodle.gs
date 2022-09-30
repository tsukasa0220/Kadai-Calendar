// Cookieのユーティリティクラス
class CookieUtil {
  // @param {string} cookie Cookieデータ（"name=value;...")
  // name == key なら return name=value;
  static getValue(cookies, key) {
    const cookiesArray = cookies.split(';');
    for(const c of cookiesArray){
      const cArray = c.split('=');
      if(cArray[0] == key){
        return cArray[0] + '=' + cArray[1] + ';';
      }
    }
    return false;
  }
}

// ブラウザにからアクセスしているかのように偽装（マクロ対策）
const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.53';

// moodleへのログイン処理
function login(id, pass) {
  let response, cookies, data, $, headers, payload, options, moodleSession;

  // ログインページを開く(GET) <200>
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/login/index.php');

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

  Utilities.sleep(500);

  // ログインフォーム送信(POST) <303>
  headers = {
    'cookie': moodleSession,
    'user-agent': user_agent
  }
  payload = {
    'logintoken': logintoken,
    'username': id,
    'password': pass
  }
  options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
    'followRedirects': false
  }
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/login/index.php', options);

  // MoodleSessionを取得し次のリクエストにセット
  // Set-cookieが複数あるため，キーが”MoodleSession”の値を取り出す
  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]
    if (CookieUtil.getValue(cookie, 'MoodleSession')) {
      moodleSession = CookieUtil.getValue(cookie, 'MoodleSession')
    }
  }
  if (moodleSession == false) {
    Logger.log("失敗[002]"); 
    return false;
  }

  Utilities.sleep(500);

  // 直近イベントのカレンダーのページ(GET) <200>
  headers = {
    'cookie': moodleSession,
    'user-agent': user_agent,
  }
  options = {
    'method': 'get',
    'headers': headers,
  }
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/calendar/view.php?view=upcoming&course=1', options);

  data = response.getContentText();

  return data;
}
