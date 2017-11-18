document.addEventListener('DOMContentLoaded', function() {

  var nextButton = document.getElementById('nextBtn');
  nextButton.addEventListener('click', function() {
	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.nextGroup();
	});
  }, false);

  var clearButton = document.getElementById('clearBtn');
  clearButton.addEventListener('click', function() {
	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.clear();
	});
  }, false);

}, false);
