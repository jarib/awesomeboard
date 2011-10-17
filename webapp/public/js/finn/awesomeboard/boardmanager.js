var FINN = FINN || {};
FINN.awesomeboard = FINN.awesomeboard || {};

FINN.awesomeboard.boardmanager = (function(hub, mu){
	var templateId = "",
		tweets = [],
		currentIndex = 0;
	function updateBoard(){
		var focusTweet = mu.to_html(document.getElementById(templateId).innerHTML, tweets[currentIndex]);
		$(".awesomeboard:first").html(focusTweet);
	}
	function initialize(options){
		hub.subscribe("got-new-tweets", function(newTweets){
			tweets = newTweets;
		});
		hub.subscribe("templates-ready", function(template){
			templateId = template;
		});
		$(document).delegate("body", "click", function(){
			currentIndex = currentIndex + 1;
			updateBoard();
		})
	}
	return {
		initialize: initialize,
		updateBoard: updateBoard
	}

}(FINN.eventHub, Mustache));


