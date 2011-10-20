Harvest Tweets and display them with the Awesome Board
=============
Simple application we use to harvest tweets about our company real time and then have them displayed in an application.
The name Awesome Board is in fact somewhat of a joke and we don't actually think it is that awesome :)

The Harvester utilize the [Twitter Streaming API](https://dev.twitter.com/docs/streaming-api) and stores the data in MongoDB.
The Awesome Board is an [ExpressJS](http://expressjs.com/) web application which reads from the database and displays the data.

We use this at [FINN.no](http://finn.no) to display customer feedback on various screens in our office


Pre-requisits
- Sign up for a [Twitter account](http://twitter.com)
- Install [MongoDB](http://www.mongodb.org/) on your machine or on some server

Either install these with NPM or place the content of the modules into the lib directory
- [ExpressJS](http://expressjs.com/)
- [Mongodb for NodeJS](https://github.com/christkv/node-mongodb-native)
- [Twitter-node](https://github.com/technoweenie/twitter-node)
- [Connect](http://senchalabs.github.com/connect/)



Useage
------------
Starting the harvester

    node harvester.js
	
Starting the Awesome Board

    node app.js

Now you can check http://localhost:29099/ or you can view the list mode on http://localhost:29099/list	
	
Developed by FINN.no, check our blog for more cool stuff http://tech.finn.no