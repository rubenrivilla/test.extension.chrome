var count = 0;
var codename = 'aaa';
var path = null;
var downloadeds = []; 

function clear() {
  count = 0;
  codename = 'aaa';
  path = null;
  downloadeds = [];   
}

function nextGroup() {
  count = 0;
  codename = nextLetter(codename);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (sender.url.indexOf("background") !== -1) {
      return;
    }
    var url = request.file;
    var ext = getExtension(url);
    var filename = generateFileName(ext);
    getPath();
    downloadeds.push(url);
    chrome.downloads.download({ url: url, filename: path+filename, saveAs: false });
    showNotification(filename);
  }
);

chrome.downloads.onChanged.addListener( function(change){
  if (!change.state) { 
    return;
  } else if(change.state.current !== "complete") {
    return;
  } else {
    chrome.downloads.search({id: change.id}, function(downloads){
      var find = downloads[0];
      var found = null;
      for (index = 0; index < downloadeds.length; index++) {
        if (downloadeds[index] == find.url) {
          found = index;
          break;
        }
      }
      if (found !=  null) {
        downloadeds.splice(found, 1);
        window.setTimeout( function(){ chrome.downloads.erase({ id: find.id }); }, 1000);
      }
    });
  }
});

function showNotification(fileName) {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var notification = new Notification(hour + time[2] + ' ' + period, {
    icon: 'icon48.png',
    body: fileName
  });
  setTimeout(notification.close.bind(notification), 1000);
}

function getPath() {
  if (path == null || path == "") {
    path = prompt("Please enter path", "");
    getPath();
  }
  if (!path.endsWith('/')) {
    path = path + '/';
  }
}

function generateFileName(ext) {
  var fileName;
  count ++;
  if (count < 100) {
    fileName = '0'
  }
  if (count < 10) {
    fileName = fileName+'0'
  }
  fileName = codename+'_'+fileName+count+ext;
  return fileName;
}

function getExtension(url) {
  if (stringStartsWith(url,'data')) {
    var lowerCase = url.toLowerCase();
    if (lowerCase.indexOf("image/png") !== -1) {
      return ".png"
    } else if (lowerCase.indexOf("image/jpg") !== -1 || lowerCase.indexOf("image/jpeg") !== -1) {
      return ".jpg"
    } else if (lowerCase.indexOf("image/gif") !== -1) {
      return ".gif"
    } else {
      return ".jpg";
    }
  } else {
    var ext = url.substring(url.lastIndexOf('.'));
    if (ext.indexOf("?") !== -1) {
      ext = ext.substring(0,ext.indexOf('?'));
    }
    if (!ext.match(/\.(jpg|jpeg|png|gif)$/)) {
      ext = ".jpg";
    }
    return ext;
  }
}

function stringStartsWith(string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

function nextLetter(s){
  return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
    var c= a.charCodeAt(0);
    switch(c){
      case 90: return 'A';
      case 122: return 'a';
      default: return String.fromCharCode(++c);
    }
  });
}
