(function(F){
    var callback, baseURL = "/api/report";
    function leaderboard(mainCategory, numDays, limit, callback){
        var command = {
          "category": JSON.stringify(mainCategory),
          "days": JSON.stringify(numDays),
          "limit": limit
        };
        queryServer(baseURL + "/leaderboard", "GET", "category=" + mainCategory + "&" + "days=" + numDays + "&limit=" + limit, callback);
    }
    function handleServerError(xhr, status){
        console.log("Error:", xhr, status);
    }
	function retrieveTemplates(callback){
		queryServer("/renderingTemplates", "GET", "", "html", callback)
	}
	function retrieveTweets(callback){
		queryServer("/tweets", "GET", "", "json", callback);
	}
    function queryServer(url, method, command, dataType, queryCallback, errorCallback){
        var jsonCommand = JSON.stringify(command);
        console.log("LogCommand:"+ jsonCommand, command);
        $.ajax({
            type: method,
            url: url,
            data: command,
            processData: false,
            timeout: 10000,
            dataType: dataType,
            contentType: "application/json;charset=UTF-8",
            beforeSend: function(){
                console.log("Retrieving URL:" + url);
            },
            success: function (data, status, xhr) {
                console.log("Retrieved URL:" + url);
                if (queryCallback != null){
                    queryCallback.apply(null, [data]);
                }
            },
            complete: function(){
                console.log("Request complete");
            },
            error: function(xhr, status){
                if (errorCallback != null){
                    errorCallback.apply(null [xhr, status]);
                } else {
                    handleServerError(xhr, status)
                }
            }
        });
    }
    var publicAPI = {
        retrieveTemplates: retrieveTemplates,
		retrieveTweets: retrieveTweets
    };
	F.awesomeboard = F.awesomeboard || {};
    F.awesomeboard.facade = publicAPI;
}(FINN || {}));