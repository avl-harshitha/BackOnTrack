// Saves options to chrome.storage
function display_storage(key) {
  chrome.storage.local.get([key], function(result) {
    console.log(JSON.stringify(result))
  });
}

function update_status() {
  var status = document.getElementById('status');
  status.textContent = 'Options saved.';
  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

function update_options(domain, url) {
  var blockedSitesList;
  if(!localStorage.blockedSites)
    localStorage.blockedSites = JSON.stringify([])
  else
    blockedSitesList = JSON.parse(localStorage.blockedSites)
  blockedSitesList.push(domain)
  localStorage[domain] = 0
  localStorage.blockedSites =  JSON.stringify(blockedSitesList)
}

function save_options() {
  var domain = document.getElementById('urltext').value
  var url = {};
  update_options(domain, url);
  update_status();
  restore_options();
}


function restore_options() {
  document.getElementById('urltext').value = "";
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);