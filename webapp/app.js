var express = require('express'), 
	mongo = require('mongodb'),
	mu = require("mustache"), 
    fs = require("fs"),
	http = require('http'),	
    sys = require('sys'),
	config = require("../appConfig").config,
	mustacheConfig = require("../lib/mustache-node/mustache-node"), 
	db, app;

var host = process.ARGV[2] || config.databaseHost,
	port = config.databasePort,
	dbName = config.databaseName,
	webappPort = config.webappPort,
	error = false;

app = express.createServer();

var mustachePartials = retrievePartials();
initializeExpressApplication(app);
initializeDatabase(host, port);

app.listen(webappPort);
sys.log('Express app started on port :' + webappPort);

function initializeDatabase(host, port){
	sys.log("Connecting to MongoDB " + host + ":" + port);
	db = new mongo.Db(dbName, new mongo.Server(host, port, {}), {});
	db.open(function(err, db) {});
	db.addListener("error", function(error){
	   sys.puts("MongoDB error: " + error);
	   die();
	});

}
function die(){
	sys.log("Error starting application, see log");
	db.close();
	error = true;
	process.exit(0);
}

/** 
 * Retrieves the partial files from the tempalte directory
 **/
function retrievePartials() {
	var fs = require("fs"), partials = {};
	fs.readFile(__dirname + "/mu/feedback.partial.mu", function(err, data) {
		if (err) throw err;
		partials.mu_feedback_partial = ("" + data).replace(/\n+/g, "");
	});
	fs.readFile(__dirname + "/mu/awesome.style.partial.mu", function(err, data) {
		if (err) throw err;
		partials.mu_awesome_style_partial = ("" + data).replace(/\n+/g, "");
	});
	return partials;
}

function initializeExpressApplication(app){
	// Path to our public directory
	var pub = __dirname + '/public';

	app.use(app.router);
	app.use(express.static(pub));
	app.use(express.errorHandler({ dump: true, stack: true }));
	app.use(express.bodyParser());

	app.set("view options", {layout: false});
	app.set('views', __dirname + '/mu');
	app.register(".mu", mustacheConfig.config);
	app.set("view engine", "mu");
	app.use(express.errorHandler({
	    dumpExceptions:true, 
	    showStack:true
	}));
	app.get("/list", function(req, res) {
	   db.collection('tweets', function(err, collection) {
              var hits = 20;
              if (req.query.hits) {
                 hits =  req.query.hits;
              }
              var skip = 0;
              var page = 1;
              if (req.query.page) {
                 page = parseInt(req.query.page);
                 skip = hits * (page - 1);
              }
              var q = req.query.q;
	      collection.find({ $or : [ {'nick' : q}, {'tweet' : new RegExp(q) }] }, {'limit':hits, 'skip':skip, 'sort':[['timestamp',-1]]}, function(err, cursor) {
			cursor.toArray(function(eRr, docs) {
		    	if (docs.length > 0) {
			      res.render("list", {
				  	locals:{
                            items: docs,
                            link: function() { return "<a href=\"http://twitter.com/#!/" + this["nick"] + "/status/"  + this["id"] + "\">[link]</a>"; },
                            tweettimestamp: function() { return new Date(parseInt(this["timestamp"])) ; },
                            prevpage: function() { return page - 1; },
                            nextpage: function () { return page + 1; },
                            hasMore: function() { return docs.length == hits; },
                            notFirstPage: function() { return page != 1; },
                            query: q
					  }, partials: {
					     list: "{{#items}}<tr><td>@{{nick}}</td><td>{{tweet}}</td><td>({{tweettimestamp}})</td><td>{{{link}}}</td></tr>{{/items}}",
		                             older: "<a href=\"/list?q={{query}}&page={{nextpage}}\">&lt;&lt; Older</a>",
		                             newer: "<a href=\"/list?q={{query}}&page={{prevpage}}\">Newer &gt;&gt;</a>",
					  }
			      });		
                } else {
                   res.send("Ingen flere treff");
                }
			 });
	      });
       });
	});
	app.get("/tweets", function(req,res){
		retrieveTweets(function(tweets){
			res.send(tweets);
		});
	});
	app.get("/renderingTemplates", function(req, res){
		res.send("" + mustachePartials.mu_feedback_partial);
	})
	app.get("/ping", function(req, res){
		res.send("pong");
	});
	app.get('/', function(req, res){
		retrieveTweets(function(tweets){
			renderTweets(req, res, tweets);
		});
	});
}
function retrieveTweets(callback){
	db.collection('tweets', function(err, collection) {
	      collection.find({}, {'limit':20, 'sort':[['timestamp',-1]]}, function(err, cursor) {
	         cursor.toArray(function(err, docs) {
				var tweeeets = {};
				if (docs.length > 0){
		            
					tweeeets = docs;
				}
				callback(tweeeets);
	         });
	      });
	   });	
}

function renderTweets(req, res, tweets){
	if (tweets.length > 0){
		for (var i=0; i<tweets.length; i++) {
		   var itemDate = new Date(parseInt(tweets[i].timestamp));
		   tweets[i].date = itemDate;
		   tweets[i].formatedDate = itemDate.getHours() + ":" + itemDate.getMinutes() + ":" + itemDate.getSeconds() + " " + itemDate.getUTCDate() + "/" + (itemDate.getUTCMonth() +1) + "/" + itemDate.getUTCFullYear();
			var newProfileImage = tweets[i].source.user.profile_image_url.replace("_normal", "_bigger");
			tweets[i].source.user.profile_image_url_bigger = newProfileImage;
           }
		var focusTweet = tweets.shift();
           var now = new Date();
		var dato = new Date(Date.parse(now));
		// nasty parsing....
		var lastUpdated = dato.getHours() + ":" + dato.getMinutes() + ":" + dato.getSeconds() + " " + dato.getUTCDate() + "/" + (dato.getUTCMonth() +1)+ "/" + dato.getUTCFullYear();
		focusTweet.formatedDate = lastUpdated;
		var counter = 0;				
           res.render("awesomeboard", {
			locals:{ 
				latest: focusTweet, 
				tweets: tweets, 
				smiles: 90,
				angyr: 10,
				hasFocusTweet: function(){
					return (tweets[counter].tweetLinkUrl);
				},
				times: function(){
					return lastUpdated;
				}
			},partials: {
				feedback_partial: "" + mustachePartials.mu_feedback_partial,
				awesome_style_partial: "" + mustachePartials.mu_awesome_style_partial
			}
		});
	} else {
		res.render("awesomeboard", {locals:{}});
	}
}
