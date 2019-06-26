
if (!localStorage.sites) {
  localStorage.sites = JSON.stringify({});
}
if (!localStorage.blockedSites) {
  localStorage.blockedSites = JSON.stringify({});
}
if(!localStorage.currentSite)
localStorage.currentSite = null;
if(!localStorage.startTime)
localStorage.startTime = null;


chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    updateTimeWithCurrentTab();
  }
);


chrome.tabs.onActivated.addListener(
  function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      setCurrentFocus(tab.url);
    });
  }
);


chrome.windows.onFocusChanged.addListener(
  function(windowId) {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
      setCurrentFocus(null);
      return;
    }
    updateTimeWithCurrentTab();
  }
);


function updateTimeWithCurrentTab() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      var url = tabs[0].url;
      chrome.windows.get(tabs[0].windowId, function(win) {
        if (!win.focused) {
          url = null;
        }
        setCurrentFocus(url);
      });
    }
  });
}


function setCurrentFocus(url) {
  updateTime();
  if (url == null) {
    localStorage.currentSite = null;
    localStorage.startTime = null;
  } 
  else {
    localStorage.currentSite = getSiteFromUrl(url);
    localStorage.startTime = new Date();
  }
};



function getSiteFromUrl(url) {
  if(url != undefined && url.localeCompare("chrome://newtab/") != 0)
    { var durl = new URL(url)
      var domain = String(durl.hostname)
      var domain = domain.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0];
      return domain;
    }
    return null;
};



function updateTime() {
  updateFilters()
  if (!localStorage.currentSite || !localStorage.startTime) {
    return;
  }
  var curr_url = localStorage.currentSite
  if(!isBlockedSite(curr_url)) {
    return;
  }
  var currTime = Date.parse(new Date())
  var startTime = Date.parse(localStorage.startTime)
  var delta = (currTime - startTime) / 1000
  console.log("Site: " + localStorage.currentSite + " Delta = " + delta);
  
  
  if (!localStorage[curr_url]) {
    localStorage[curr_url] = parseInt(delta);
  }
  else{
  localStorage[curr_url] = parseInt(localStorage[curr_url]) + parseInt(delta);
  }

};


function isBlockedSite(url) {
  var blockedSitesList = JSON.parse(localStorage.blockedSites);
  for (i = 0; i <blockedSitesList.length; i++) {
    // console.log(blockedSitesList[i])
    if (url.localeCompare(blockedSitesList[i]) == 0) {
      console.log("blocked site")
      return true;
    }
  }
  return false;
}

function blockRequest(details) {
  return {cancel:true}
}

function updateFilters() {
  // var url_links = getRegex(JSON.parse(localStorage.blockedSites))
  if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: getRegex(JSON.parse(localStorage.blockedSites))}, ['blocking']);
}

function getRegex(siteList) {
  regexList = []
  for(i = 0; i < siteList.length; i ++) {
      var site = siteList[i]
      // console.log("time spent" + localStorage[site])
      if(parseInt(localStorage[site]) > 20){
        regexList.push("*://*." + siteList[i] + "/*")
        console.log("time spent" + localStorage[site])
      }
  }
  return regexList
}

// updateFilters()

