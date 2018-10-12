function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createAddonMenu()
        .addItem('Open Sidebar', 'openSidebar')
        .addToUi();
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        {name: 'Prepare sheet...', functionName: 'prepareSheet'},
        {name: 'Open Sidebar', functionName: 'openSidebar'}
    ];
    spreadsheet.addMenu('GAS', menuItems);
}

function openSidebar( ) {
    var html = HtmlService.createTemplateFromFile('sidebar')
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.NATIVE)
        .setTitle('GitHub User Search')
        .setWidth(300);
    SpreadsheetApp.getUi().showSidebar(html);
}
function prepareSheet() {
    var sheet = SpreadsheetApp.getActiveSheet().setName('GitHubUsers');
    var headers = [
        'Nickname',
        'Id',
        'Avatar',
        'Email',
        'Public repos'];
    sheet.getRange(1, 1, 500, 500).clearContent();
    // sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).clearContent();
    sheet.getRange('A1:E1').setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    //sheet.autoResizeColumns(1, 5);
    sheet.setColumnWidths(1, 5, '100');
    sheet.getRange('A1:E1').setHorizontalAlignment("center");
}

function callGitHubAPI(username) {
    // Call the GitHub API
    var response = UrlFetchApp.fetch("https://api.github.com/search/users?q=" + username );

    // Parse the JSON reply
    var json = response.getContentText();
    //Logger.log(json);
    return JSON.parse(json);
}

function displayUsersData() {
    var data = callGitHubAPI('ross');
    var result = data["items"]["id"];
    Logger.log(result);
}