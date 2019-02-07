// TODO: get rid of hard-coded values i.e. instead of hardcoding strings, find it from the sheet
// run housing() to generate
// NOTE: can use sheet.getDataRange().randomize() to randomly move rows around, alternative algo
// may have to manually move some room assignments around to accommodate for special preferences and to balance out nlcc

var ROOM_SIZE = 10;
var MASTER_SHEET = "Sign";
var GENDER_COL = "Gender";
var SINGLE_FAMILY_COL = "Single or Family";
var SLEEPER_COL = "What kind of sleeper are you?";

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var signups = findSheet(MASTER_SHEET);
var maleHousing = spreadsheet.getSheetByName("Housing - Male");
var femaleHousing = spreadsheet.getSheetByName("Housing - Female");
var familyHousing = spreadsheet.getSheetByName("Housing - Family");

function housing() {
  createSheets();
  copyHeaderRow();
  assign();
}

function findSheet(input) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetName().indexOf(input) > -1) {
      return sheets[i];
    }
  }
}

function createSheets() {
  if (maleHousing == null) {
    spreadsheet.insertSheet("Housing - Male");
  }
  if (femaleHousing == null) {
    spreadsheet.insertSheet("Housing - Female");
  }
  if (familyHousing == null) {
    spreadsheet.insertSheet("Housing - Family");
  }
}

function copyHeaderRow() {
  maleHousing.clear();
  femaleHousing.clear();
  familyHousing.clear();
  var colSize = signups.getDataRange().getLastColumn();
  signups.getRange(1, 1, 1, colSize).copyTo(maleHousing.getRange(1, 1));
  signups.getRange(1, 1, 1, colSize).copyTo(femaleHousing.getRange(1, 1));
  signups.getRange(1, 1, 1, colSize).copyTo(familyHousing.getRange(1, 1));
}

function assign() {
  var data = signups.getDataRange().getValues();
  var maleLight = [];
  var maleNorm = [];
  var maleHeavy = [];
  var femaleLight = [];
  var femaleNorm = [];
  var femaleHeavy = [];
  
  // figuring out column positions of conditionals
  var genderPos = columnPosition(data[0], GENDER_COL);
  var singlePos = columnPosition(data[0], SINGLE_FAMILY_COL);
  var sleeperPos = columnPosition(data[0], SLEEPER_COL);
  
  // organizing singles by gender and sleeper
  for (var i = 0; i < data.length; i++) {
    if (data[i][singlePos].toString() === "Single") {
      var row = data[i];
      if (data[i][genderPos].toString() === "Male") {
        if (data[i][sleeperPos].toString() === "Light") {
          maleLight.push(data[i]);
        } else if (data[i][sleeperPos].toString() === "Normal") {
          maleNorm.push(data[i]);
        } else if (data[i][sleeperPos].toString() === "Heavy") {
          maleHeavy.push(data[i]);
        }
      } else if (data[i][genderPos].toString() === "Female") {
        if (data[i][sleeperPos].toString() === "Light") {
          femaleLight.push(data[i]);
        } else if (data[i][sleeperPos].toString() === "Normal") {
          femaleNorm.push(data[i]);
        } else if (data[i][sleeperPos].toString() === "Heavy") {
          femaleHeavy.push(data[i]);
        }
      }
    }
    else if (data[i][singlePos].toString() === "Family") {
      familyHousing.appendRow(data[i]);
    }
  }
  
  // populating males onto sheet
  addToSheet(maleHousing, maleLight);
  addToSheet(maleHousing, maleNorm);
  addToSheet(maleHousing, maleHeavy);
  
  // populating females onto sheet
  addToSheet(femaleHousing, femaleLight);
  addToSheet(femaleHousing, femaleNorm);
  addToSheet(femaleHousing, femaleHeavy);
  
  // assigning rooms
  addRoomNum(maleHousing);
  addRoomNum(femaleHousing);
}

function columnPosition(array, string) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].toString() === string) {
      return i;
    }
  }
}

function addRoomNum(sheet) {
  var lastCol = sheet.getDataRange().getLastColumn();
  var lastRow = sheet.getDataRange().getLastRow();
  sheet.getRange(1, lastCol+1).setValue("Room");
  for (var i = 2; i <= lastRow; i++) {
    var roomNum = Math.ceil(((i-1) / ROOM_SIZE));
    sheet.getRange(i, lastCol+1).setValue(roomNum);
  }
}

function addToSheet(sheet, array) {
  shuffleArray(array);
  for (var i = 0; i < array.length; i++) {
    sheet.appendRow(array[i]);
  }
}

function shuffleArray(array) {
  var i, j, temp;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
