let redeem = document.getElementById('redeem');
let coins = document.getElementById('coins')
// console.log("hello")

  // changeColor.style.backgroundColor = data.color;
  // changeColor.setAttribute('value', data.color);
  coins.innerHTML = "Your coins are " + (localStorage.coins)

  redeem.onclick = function() {
    var currSite = localStorage.currentSite
    // coins.innerHTML = currSite
    if(currSite && isBlockedSite(currSite)) {
      localStorage[currSite] = 0;
      localStorage.coins = parseInt(localStorage.coins) - 60;
      coins.innerHTML = "Your coins are " + (localStorage.coins) + " currentSite " + currSite
    }
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
