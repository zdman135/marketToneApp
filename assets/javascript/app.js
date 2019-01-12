//  constants
var watstonAPIKeY = btoa('apikey:4183-tWTIj-xTstT8XVc4uQqRgJfZhHOLiJb5U8PvrxX');
var newsAPIKey = '860ca082a90441caa0446fdf630130da';
var placeHolderObject = {};

var articlesTextForWatson;

function analyzeTickerSymbol(tickerSymbol) {
    getNewsArticles(tickerSymbol);
}

function getToneOfArticle(articlesTextForWatson) {
    $.ajax({
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + watstonAPIKeY,
            'Content-Type':'application/json'
        },
        url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21',
        data: JSON.stringify(
            {"text": articlesTextForWatson}
        ),
        dataType: 'json'
      }).then(function(response) {
        (response);
      
    }).catch(function(error) {
          console.log(error);
    });

}

function getNewsArticles(userSearchQuery) {
    var searchQuery = 'q=' + userSearchQuery;
    var sources = '&sources=' + 'the-wall-street-journal,bloomberg,business-insider,cnbc,the-verge,wired';
    var apiKey = '&apiKey=' + newsAPIKey;
    var queryURL = 'https://newsapi.org/v2/everything?' + searchQuery + sources + apiKey;
    
    var articleDescriptionArray = []

    $.ajax({
        url: queryURL,
        method: 'GET'
      })
        .then(function(response) {
            response.articles.forEach(function(element) {
                articleDescriptionArray.push(element.description);
            });

            articlesTextForWatson = articleDescriptionArray.join(",");
            getToneOfArticle(articlesTextForWatson);
    });
}

$('#analyze-btn').on('click', function() {
    var tickerSymbol= $('#tickerSymbol').val().trim();
    analyzeTickerSymbol(tickerSymbol);

});



