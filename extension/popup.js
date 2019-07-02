let redeem = document.getElementById('redeem');
let coins = document.getElementById('coins')
let time = document.getElementById('time')
let imageIcon = document.getElementById('icon')

var dailyLimit = 60

  
  var currSite = localStorage.currentSite
  var green = "#4C9900"

  if(!isBlockedSite(currSite)) {
    coins.innerHTML = ""
    imageIcon.setAttribute('src',"images/thumbsup.png")
    time.innerHTML = currSite + " is not a blocked site"
    redeem.disabled = true;
    redeem.style.visibility = "hidden";
}
  if(isBlockedSite(currSite)) {
    if(!localStorage["coins" + currSite])
      localStorage["coins" + currSite] = 0;
    coins.innerHTML = "Your coins are " + (localStorage["coins" + currSite])

    if(localStorage[currSite] < dailyLimit) {
        time.innerHTML = "Time left " + parseInt(dailyLimit - parseInt(localStorage[currSite] )) + " minutes"
        redeem.disabled = true;
        redeem.style.visibility = "hidden";
    }
    else {
      time.innerHTML = "Daily limit over"
      if(parseInt(localStorage["coins" + currSite]) >= dailyLimit ) {
      redeem.style.backgroundColor = green;
      }
      else {
        document.body.style.backgroundColor = "#ebeced";
        redeem.disabled = true;
        redeem.style.visibility = "hidden";
      }
    }
  }

  redeem.onclick = function() {

      localStorage[currSite] = 0;
      localStorage["coins"+currSite] = parseInt(localStorage["coins"+currSite]) - dailyLimit;
      coins.innerHTML = "Your coins are " + (localStorage["coins" + currSite])
      redeem.disabled = true;
      redeem.style.visibility = "hidden";
  
  }


  function isBlockedSite(url) {
    var blockedSitesList = JSON.parse(localStorage.blockedSites);
    for (i = 0; i <blockedSitesList.length; i++) {
      if (url.localeCompare(blockedSitesList[i]) == 0) {
        return true;
      }
    }
    return false;
  }
