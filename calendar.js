"use strict";

var allMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var date = new Date();
var curM = date.getFullYear() + ("00" + (date.getMonth() + 1)).slice(-2);
var leapY = 0;

document.querySelector('input[name="input"]').value = curM;

function isLeapYear(y) {
  if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) {
    return true;
  } else return false;
}

function dateCal(year) {
  //console.log(year);
  for (var i = 1; i < year + 1; i++) {
    if (isLeapYear(i)) leapY += 1
  }
  return (year - leapY) * 365 + leapY * 366;
}

function dayOfYear(dtm) {
  if (typeof dtm === 'number') dtm = String(dtm);
  if (dtm.length === 8) {
    var rtnVal = 0;

    var y = Number(dtm.substr(0, 4));
    var m = Number(dtm.substr(4, 2));
    var d = Number(dtm.substr(6, 2));

    if (isLeapYear(y) && m > 2) rtnVal += 1;

    if (m > 1) {
      for (var i = 0; i < m - 1; i++) {
        rtnVal += allMonth[i];
      }
    }
    // debugger;
    //console.log(d, dateCal(y-1));
    rtnVal += d + dateCal(y-1);
    //console.log(rtnVal);
    leapY = 0

    return rtnVal
  } else {
    return "정확한 날짜 정보가 아닙니다.";
  }
}

function makecalendar(curMonth) {
  var fullDate = curMonth + "01";
  var month = Number(curMonth.slice(4));

  allMonth[1] = isLeapYear(curMonth.slice(0,4)) ? 29 : 28;

  var curcalendar = [];
  for (var i = 0; i < allMonth[month - 1]; i++) {
    curcalendar[dayOfYear(fullDate) % 7 + i] = i + 1;
  }

  var calRows = [];
  while (curcalendar.length) {
    calRows.push(curcalendar.splice(0, 7));
  }

  return calRows;
}

function rendering(cal) {
  var strDiv = "";
  for (var i = 0; i < cal.length; i++) {
    strDiv = "<div class='down'>"
    for (var j = 0; j < cal[0].length; j++) {
      if (cal[i][j] === undefined) {
        strDiv += '<div class="day"></div>';
      } else {
        if (j === 0) {
          strDiv += '<div class="day sun">' + cal[i][j] + '</div>';
        } else if (j === 6) {
          strDiv += '<div class="day sat">' + cal[i][j] + '</div>';
        } else {
          strDiv += '<div class="day">' + cal[i][j] + '</div>';
        }
      }
    }
    strDiv += "</div>"
    document.querySelector('.calendar').innerHTML += strDiv;
  }
  document.querySelector('#month').innerHTML = curM.substr(0, 4) + '.' + curM.substr(4, 2);
}

rendering(makecalendar(curM));

document.querySelector('#buttons').addEventListener('click', function (e) {
  var y = Number(curM.substr(0, 4));
  var m = Number(curM.substr(4, 2));
  if (e.target.id === "prev") {
    document.querySelector('.calendar').innerHTML = "";
    if (m - 1 < 1) {
      curM = y - 1 + "12";
      rendering(makecalendar(curM));
    } else {
      curM = y + ("00" + (Number(m) - 1)).slice(-2);
      rendering(makecalendar(curM));
    }
  } else if (e.target.id === "next") {
    document.querySelector('.calendar').innerHTML = "";
    if (m + 1 > 12) {
      curM = y + 1 + "01";
      rendering(makecalendar(curM));
    } else {
      curM = y + ("00" + (Number(m) + 1)).slice(-2);
      rendering(makecalendar(curM));
    }
  } else if (e.target.id === "move") {
    var ym = document.querySelector('input[name="input"]').value;
    if (ym.length !== 6 || ym.substr(4, 2) > 12) {
      console.log("잘못된 날짜정보입니다.");
      return;
    }
    curM = ym;
    document.querySelector('.calendar').innerHTML = "";
    rendering(makecalendar(document.querySelector('input[name="input"]').value));
  }
});