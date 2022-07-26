// 13KJxU8q0ZYmZXyQswU2HrkQX-yXlgnlJ3BVzsKrS69oaE4FcViPRFPZb
// HTMLから指定されたnameのタグの値を抽出
const cheerio = libpack.cheerio();

const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.71';

//Cookieのユーティリティクラス
class CookieUtil {
  /**
   * 値を抽出
   * @param {string} cookie Cookieデータ（"name=value;...")
   * @return {string} value
   */
  static getValue(cookies, key) {
    const cookiesArray = cookies.split(';');

    for(const c of cookiesArray){
      const cArray = c.split('=');
      if(cArray[0] == key){
        return cArray[1]
      }
    }
    return false
  }
}

// moodleへのログイン処理
function login(id, pass) {

  let response, cookies, data, $, headers, payload, options;

  // ログインページを開く(GET)<200>
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/login/index.php');
  cookies = response.getHeaders()["Set-Cookie"];
  let cookieMoodleSession = CookieUtil.getValue(cookies, 'MoodleSession');
  data = response.getContentText("UTF-8");

  $ = cheerio.load(data);
  const token = $('[name="logintoken"]').val();

  Utilities.sleep(300);

  // ログインフォーム送信(POST)<303>
  headers = {
    'cookie': 'MoodleSession=' + cookieMoodleSession + ';',
    'user-agent': user_agent,
  }
  payload = {
    'logintoken': token,
    'username': id,
    'password': pass,
  }
  options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
    'followRedirects': false,
  }
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/login/index.php', options);

  // MoodleSessionを取得し次のリクエストにセット

  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]

    if (CookieUtil.getValue(cookie, 'MoodleSession')) {
      cookieMoodleSession = CookieUtil.getValue(cookie, 'MoodleSession')
    }
  }
 
  Utilities.sleep(300);

  // リダイレクト処理(GET)<303>
  headers = {
    'cookie': 'MoodleSession=' + cookieMoodleSession + ';',
    'user-agent': user_agent,
  }
  options = {
    'method': 'get',
    'headers': headers,
    'followRedirects': false,
  }
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/login/index.php?testsession=', options)

  cookies = response.getHeaders()["Set-Cookie"];

  Utilities.sleep(300);

  // カレンダーのページ(GET) <200>
  headers = {
    'cookie': 'MoodleSession=' + cookieMoodleSession + ';',
    'user-agent': user_agent,
  }
  options = {
    'method': 'get',
    'headers': headers,
    'followRedirects': false,
    'muteHttpExceptions': false,
  }
  response = UrlFetchApp.fetch('https://kadai-moodle.kagawa-u.ac.jp/calendar/view.php?view=upcoming&course=1', options);
  data = response.getContentText();
  
  $ = cheerio.load(data);
  
  return data;
}
