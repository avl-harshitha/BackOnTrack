{/* <script src="http://timemejs.com/timeme.min.js"></script> */}
var seconds = 0;
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
  chrome.tabs.get(tabid, function(tab) {
    if(tab!=undefined && tab.url != undefined && tab.url.localeCompare("chrome://newtab/") != 0)
    { var durl = new URL(tab.url)
      var domain = String(durl.hostname)
      var domain = domain.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0];
  
      chrome.storage.local.get([domain], function(result) {
        if(result[domain]!=undefined) {
          newurl = {regex:result[domain]["regex"], time:seconds + result[domain]["time"]}
          chrome.storage.local.set({
            [domain]: newurl
          }, function() {
            seconds = 0;
            chrome.storage.local.get([domain], function(result) {
              // alert(JSON.stringify(result))
            });
          });
      }
      });
  
   }
  })
 })







 chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab) {
   if(changeinfo.url != undefined && changeinfo.url.localeCompare("chrome://newtab/") != 0)
  { var durl = new URL(changeinfo.url)
    var domain = String(durl.hostname)
    var domain = domain.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0];

    chrome.storage.local.get([domain], function(result) {
      if(result[domain]!=undefined) {
        newurl = {regex:result[domain]["regex"], time:seconds + result[domain]["time"]}
        chrome.storage.local.set({
          [domain]: newurl
        }, function() {
          seconds = 0;
          chrome.storage.local.get([domain], function(result) {
            // alert(JSON.stringify(result))
          });
        });
    }
    });

 }
 })

//  $(window).focus(function(e) {
//   // Do Focus Actions Here
// });

 chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
  // alert("selected tab id " + tabId)
  // seconds = 0;
  // alert(seconds)
  setInterval(function () {
    seconds++;
    // if(seconds % 10 == 0)
    // {alert(seconds)}
  }, 1000);
  // alert(seconds)
  chrome.tabs.onSelectionChanged.removeListener(function(){
    // alert("removed list")
    seconds =0});
 })



console.log("Loaded extension");
chrome.storage.local.get(['url_links'], function(result) {
  // console.log(result.url_links)
  updateFilters(result.url_links);
});

function blockRequest(details) {
  // alert(details.url)
  if(details.url.localeCompare("https://www.facebook.com/") == 0)
  {
   
   return {cancel: true};
  }
  else
  return {cancel:false};
}

function updateFilters(url_links) {
   if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
     chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
   chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: url_links}, ['blocking']);
}


