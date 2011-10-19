var FINN = FINN || {};
FINN.awesomeboard = FINN.awesomeboard || {};

FINN.awesomeboard.main = (function(eventHub){

	function initialize(){	
		FINN.awesomeboard.boardmanager.initialize();
		FINN.awesomeboard.updater.start();
		retrieveRenderingTemplate();
	}
	function retrieveRenderingTemplate(){
		FINN.awesomeboard.facade.retrieveTemplates(function(template){
			document.getElementById("FeedbackPartial").innerHTML = template;
			eventHub.publish("templates-ready", "FeedbackPartial")
		});
		console.log("tempalte ready??");
	}	
	return {
		initialize: initialize,
		retrieveRenderingTemplate: retrieveRenderingTemplate
	}
}(FINN.eventHub));
$(document).ready(function(){
	FINN.awesomeboard.main.initialize();
});
