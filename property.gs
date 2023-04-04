// Cheerio: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
// Parser : 1Mc8BthYthXx6CoIz90-JiSzSafVnT6U3t0z_W3hLTAX5ek4w0G_EIrNw

// デバッグ
const DEBUG = false;

// バージョン
const VERSION = '0.9.10';

// MoodleのURL
const UNIV = {kagawa:'kadai-moodle.kagawa-u.ac.jp'};

// Moodleのカレンダーの取得範囲
const CALENDAR_TIME = '?view=upcoming&course=1';

// googleカレンダーの取得範囲
const START_TIME = -7;
const END_TIME = 31;

// アクセスするMoodleのURL
const LOGIN_URL    = `https://${UNIV.kagawa}/login/index.php`;
const CALENDAR_URL = `https://${UNIV.kagawa}/calendar/view.php${CALENDAR_TIME}`;
const LOGOUT_URL   = `https://${UNIV.kagawa}/login/logout.php`;

// ブラウザのユーザエージェントを指定 → 追記：できないっぽい
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.44';