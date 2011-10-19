<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
		<title>Awesomeboard Mark II</title>
		{{>awesome_style_partial}}
		<script src="js/lib/jquery/jquery-1.6.2.min.js"></script>
		<script src="/js/lib/mustache/mustache.js"></script>
		<script>
		var FINN = FINN || {};
		</script>
		<script src="js/finn/eventHub/eventHub.js"></script>
		<script src="js/finn/awesomeboard/facade.js"></script>
		<script src="js/finn/awesomeboard/loader.js"></script>
		<script src="js/finn/awesomeboard/boardmanager.js"></script>
		<script src="js/finn/awesomeboard/updater.js"></script>
		<script src="js/finn/awesomeboard/main.js"></script>
</head>

<body>
<div class="TWATSKALP"></div>
<article class="awesomeboard">
	{{#latest}}			
		{{>feedback_partial}}
	{{/latest}}
    </div>	
		<aside class="userSidebar" style="display:none;">
			<ul class="tweets">
			{{#tweets}}
				<li class="sidebarTweet {{oddEvenClass}}">
					{{>feedback_partial}}
			 </li>
			{{/tweets}}
			</ul>
		</aside>
		<footer>
			<a href="/list">Se som liste</a>
		</footer>
</article>
<script type="text/html" id="FeedbackPartial"></script>
</body>
</html>
