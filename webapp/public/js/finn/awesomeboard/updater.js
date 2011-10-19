var FINN = FINN || {};
FINN.awesomeboard = FINN.awesomeboard || {};

FINN.awesomeboard.updater = (function(facade, eventHub){
	var tweetCache = [];
	function pollForTweets(){
		eventHub.publish("retrieving-new-tweets", "");
		facade.retrieveTweets(function(tweets){
			if (tweets){
				if (tweetCache.length == 0 || tweetCache[0].id !== tweets[0].id){
					tweetCache = tweets;
					eventHub.publish("got-new-tweets", tweetCache);
				}
			}
		});
		setTimeout(pollForTweets, 20000);
	}
	function initiatePollSequence(){
		eventHub.subscribe("templates-ready", function(template){
			pollForTweets();
		});		
	}
	return {
		start: initiatePollSequence
	};
}(FINN.awesomeboard.facade, FINN.eventHub));