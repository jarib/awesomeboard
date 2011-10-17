var FINN = FINN || {};
FINN.awesomeboard = FINN.awesomeboard || {};

FINN.awesomeboard.main = (function(j$){

	function initialize(numberOfDays){	
		FINN.eventHub.publish("startApplication", {days: numberOfDays});
	}
	function retrieveRenderingTemplate(){
		FINN.awesomeboard.facade.retrieveTemplates(function(template){
			document.getElementById("FeedbackPartial").innerHTML = template;
			FINN.eventHub.publish("templates-ready", "FeedbackPartial")
		});
		console.log("tempalte ready??")

	}

	$(document).ready(function(){
		var numberOfDays = 1; // default
		if (this.location.href.indexOf("days=")!=-1){
			numberOfDays = this.location.href.replace(/.*days=([0-9]+).*/, "$1");
		}
		FINN.awesomeboard.boardmanager.initialize();
		FINN.awesomeboard.updater.start();
		retrieveRenderingTemplate();
	});
	
	return {
		initialize: initialize,
		retrieveRenderingTemplate: retrieveRenderingTemplate
	}
}(jQuery));