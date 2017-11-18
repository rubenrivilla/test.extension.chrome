(function(){

	$(document).ready(function() {
		document.addEventListener("click", downloadComponent);
	});

	function downloadComponent(evt) {
		var elem;
		if (evt.ctrlKey == true && evt.shiftKey == true) {
			elem = evt.target;
			if (elem.tagName.toLowerCase() == 'img') {
				saveChrome(elem.src);
			}
			$(elem).find('img').each(function() {
				saveChrome(this.src);
			});
			evt.preventDefault();
		}
	}

	function saveChrome(file) {
		chrome.runtime.sendMessage({file: file});
	}

}());