#!/opt/local/bin/node
require.paths.unshift(__dirname + "/../lib");

var mongo = require("mongodb"),
	twitter = require("twitter-node"),
	sys = require('sys'),
	config = require("../appConfig").config,
	port = config.port;

console.log("Harvesting started: " + new Date().toString());

var USERNAME = process.ARGV[2] || config.twitterUsername;
var PASSWORD = process.ARGV[3] || config.twitterPassword;
var host = process.ARGV[4] || config.databaseHost;
var trackArgument = config.trackArguments; //(process.ARGV[5]) ? process.ARGV[5].split(",") : null;
var trackTheseItems = config.trackItems;

db = new mongo.Db(config.databaseName, new mongo.Server(host, port, {}), {});
db.open(function(err, db) {});
db.addListener("error", function(error){
   console.log("MongoDB error: " + error.message);
});

process.on("SIGINT", function () {
   console.log("Got SIGINT. Stopping.");
   shutdown();
});
function shutdown(){
	db.close();	
	process.exit(0);
}
var twit = new twitter.TwitterNode({
   user: USERNAME, 
   password: PASSWORD,
   track: trackTheseItems,
   follow: config.follow
});

var numberOfRetries = 0;
twit.headers["User-Agent"] = "node.js-thingy";
twit.addListener("tweet", function(tweet) {
	var timestamp = new Date();
	db.collection("tweets", function(err, collection) {
    	if (err == null) {
			// text string indicates a test post to see if the feed is up and running
			if (tweet.text.indexOf("awesome-test")!=-1){
				sys.puts(timestamp + ": Awesomeboard test post - " + tweet.text);
			} else {
				console.log(timestamp + ": @" + tweet.user.screen_name + ": " + tweet.text);
	        	collection.insert({
					"tweet":tweet.text,
	                "id":tweet.id,
	                "timestamp":new Date().valueOf(), 
	                "nick":tweet.user.screen_name, 
					"source": tweet});
		  		}
			}
	});
}).addListener("end", function(resp){
	sys.puts("End event recieved:" + resp.statusCode);
	if (resp.statusCode == "200"){
		if (numberOfRetries < 3){
			// sometimes the stream stops and the code recieved is a 200, trying to re-attach the stram in case that works
			twit.stream();
		}
	} else if (resp.statusCode == "401"){
		console.log("Error authenticating to Twitter");
		shutdown();
	}
}).addListener('limit', function(limit) {
	    sys.puts("LIMIT: " + sys.inspect(limit));
}).addListener("error", function(error){
	console.log("Tweet error:", error.message);
}).stream();
console.log("Listening for tweets with these words: " + trackTheseItems);

