// Saves options to chrome.storage



function update_status(msg) {
  var status = document.getElementById('status');
  status.textContent = msg;
  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

function update_options(domain, url) {
  var blockedSitesList = []
  if(!localStorage.blockedSites)
  {
    localStorage.blockedSites = JSON.stringify([domain])
  }
  else{
    blockedSitesList = JSON.parse(localStorage.blockedSites)
    blockedSitesList.push(domain)
    localStorage.blockedSites =  JSON.stringify(blockedSitesList)
  }
  localStorage[domain] = 0
  
}

function save_options() {
  var domain = document.getElementById('urltext').value
  if(domain.localeCompare("") == 0 || domain == null){
    update_status("Please enter a URL");
    return;
  }
  domain = domain.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0];  
  var url = {};
  update_options(domain, url);
  update_status("Options saved");
  restore_options();
}


function restore_options() {
  document.getElementById('urltext').value = "";
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);