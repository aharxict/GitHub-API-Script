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

function searchGitHubUsers(username) {
    // Call the GitHub API
    var response = UrlFetchApp.fetch("https://api.github.com/search/users?q=" + username );

    // Parse the JSON reply
    var json = response.getContentText();
    //Logger.log(json);
    return JSON.parse(json);
}
function getUsersInfo(login) {
    // Call the GitHub API
    var response = UrlFetchApp.fetch("https://api.github.com/users/" + login );
    Logger.log(response);
    return response;
}

function displayUsersData(username) {
    var data = searchGitHubUsers(username);
    var result = data["items"];
    var total_count = data["total_count"];
    //var result2 = result[1];

    //Logger.log(result2);

    result.forEach(function(elem,i) {
        var output = []
        var login = elem.login;
        var user_id = elem.id;
        output.push([login, user_id]);
        var sheet = SpreadsheetApp.getActiveSheet()
        var last_row = sheet.getLastRow() +1;
        //var image = '=image("' + elem["artworkUrl60"] + '",4,60,60)';
        //var hyperlink = '=hyperlink("' + elem["previewUrl"] + '","Listen to preview")';
        //output.push([elem["artistName"],elem["collectionName"],elem["trackName"],image,hyperlink]);
        //sheet.setRowHeight(i+15,65);
        //Logger.log(last_row);

        sheet.getRange( last_row, 1, 1, 2).setValues(output);
    });
}

function displayUserInfo() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var last_row = sheet.getLastRow();
    var output = [];
    for (var i = 2; i <= last_row; i++) {
        var login = sheet.getRange(i,1).getValue().toString();
        //if (login == "") login = 'empty';
        // Logger.log(login);
        if (!(login == "")) {
            Utilities.sleep(4000);
            var data = getUsersInfo(login);

            //Logger.log(data);
            //sheet.getRange(i,3).setValue(value);
        }

    }

}





































