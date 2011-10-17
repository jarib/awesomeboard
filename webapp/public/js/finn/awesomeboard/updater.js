var FINN = FINN || {};
FINN.awesomeboard = FINN.awesomeboard || {};

FINN.awesomeboard.updater = (function(facade, hub){
	var tweetCache = [];
	function pollForTweets(){
		facade.retrieveTweets(function(tweets){
			if (tweets){
				if (tweetCache.length == 0 || tweetCache[0].id !== tweets[0].id){
					console.log("Got new tweeeeets!");
					tweetCache = tweets;
					hub.publish("got-new-tweets", tweetCache);
				}
			}
		});
		setTimeout(pollForTweets, 20000);
	}
	function initiatePollSequence(){
		hub.subscribe("templates-ready", function(template){
			pollForTweets();
		});		
	}
	return {
		start: initiatePollSequence
	};
}(FINN.awesomeboard.facade, FINN.eventHub));