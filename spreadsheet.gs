function setup() {
    const ui = SpreadsheetApp.getUi();
    const userProperties = PropertiesService.getUserProperties();
    if (userProperties.getProperty('auth') == 1) {
      const res = ui.alert("初期設定", "すでにユーザ名とパスワードが登録されています\n設定しなおしますか？", ui.ButtonSet.OK_CANCEL);
      if (res != ui.Button.OK) {return 0;}
    }
    const user = ui.prompt("初期設定", "ユーザ名を入力(例:s21t000)", ui.ButtonSet.OK_CANCEL);
    if (user.getSelectedButton() != ui.Button.OK) {return 0}
    const password = ui.prompt("初期設定", "パスワードを入力", ui.ButtonSet.OK_CANCEL);
    if (password.getSelectedButton() != ui.Button.OK) {return 0}
  
    if (login(user.getResponseText(), password.getResponseText())) {
      userProperties.setProperty('user', user.getResponseText());
      userProperties.setProperty('password', password.getResponseText());
      userProperties.setProperty('auth', 1);
      ui.alert("初期設定", "登録されました", ui.ButtonSet.OK);
    } else {
      userProperties.setProperty('auth', 0);
      ui.alert("初期設定", "ユーザ名またはパスワードが間違っています", ui.ButtonSet.OK);
    }
    return 0;
  }
  
  function update_calendar() {
    const ui = SpreadsheetApp.getUi();
    const userProperties = PropertiesService.getUserProperties();
    const user = userProperties.getProperty('user');
    const password = userProperties.getProperty('password');
    if (userProperties.getProperty('auth') != 1) {
      ui.alert("カレンダー更新", "ユーザ名とパスワードが登録されていません", ui.ButtonSet.OK);
      return 0;
    }
    const res = ui.alert("カレンダー更新", "カレンダーを更新しますか？", ui.ButtonSet.OK_CANCEL);
    if (res != ui.Button.OK) {return 0}
    main(user, password);
    ui.alert("カレンダー更新", "更新されました", ui.ButtonSet.OK);
  }
  
  function update_timeChange() {
    const ui = SpreadsheetApp.getUi();
    const userProperties = PropertiesService.getUserProperties();
    if (userProperties.getProperty('auth') != 1) {
      ui.alert("更新日時変更", "ユーザ名とパスワードが登録されていません", ui.ButtonSet.OK);
      return 0;
    }
    const triggers = ScriptApp.getProjectTriggers();
    if (triggers.length > 0) {
      const res = ui.alert("更新日時変更", "すでに更新日時が設定されています\n変更しますか？", ui.ButtonSet.OK_CANCEL);
      if (res != ui.Button.OK) {return 0}
    }
    while (1){
      const setHour = ui.prompt("更新日時変更", "時刻を入力してください(0~23)\n例：18時～19時 → 入力「18」", ui.ButtonSet.OK_CANCEL);
      if (setHour.getSelectedButton() != ui.Button.OK) {break;}
      const setH = setHour.getResponseText();
      if (setH.search(/[0-9]/) != -1 && setH >= 0 && setH <= 23) {
        ScriptApp.deleteTrigger(triggers[0]);
        ScriptApp.newTrigger('update_calendar').timeBased().atHour(setH).everyDays(1).create();
        ui.alert("更新日時変更", "設定が完了しました", ui.ButtonSet.OK);
        break;
      }
    }
  }