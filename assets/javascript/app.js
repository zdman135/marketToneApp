//  constants
var watstonAPIKeY = btoa('apikey:4183-tWTIj-xTstT8XVc4uQqRgJfZhHOLiJb5U8PvrxX');
var newsAPIKey = '860ca082a90441caa0446fdf630130da';
var watsonToneMapper = {
    anger: "sell",
    fear: "sell",
    joy: "buy",
    sadness: "sell",
    analytical: "hold",
    confident: "buy",
    tentative: "hold"
};
var articlesTextForWatson;

function analyzeTickerSymbol(tickerSymbol, buttonId) {
    getNewsArticles(tickerSymbol, buttonId);
}

function displayResultFromWatson(response, buttonId) {
    var tickerTone = response.document_tone.tones[0].tone_id;
    console.log(tickerTone, 'this is ticker tone');
    console.log(buttonId);
    watsonToneMapper[tickerTone]

    if (buttonId === 'analyze-btn') {
        switch(watsonToneMapper[tickerTone]) {
            case "buy":
                $('#watson-result').html('<img src="assets/images/buy-smiley.jpg">')
              break;
            case "sell":
                $('#watson-result').html('<img src="assets/images/sell-smiley.jpg">')
              break;
            case "hold":
                $('#watson-result').html('<img src="assets/images/hold-smiley.jpg">')
              break;
            default:
                $('#watson-result').html('<img src="assets/images/hold-smiley.jpg">')
          }
    } else {
        return watsonToneMapper[tickerTone];
    }
}

function faangAnalysis(buttonId) {
    var fbStock = getNewsArticles("fb", buttonId);
    var amznStock = getNewsArticles('amzn', buttonId);
    var appleStock = getNewsArticles('aapl', buttonId);
    var netflixStock = getNewsArticles('nflx', buttonId);
    var googleStock = getNewsArticles('googl', buttonId);
    console.log(fbStock);
    console.log(amznStock);
    console.log(appleStock);
    console.log(netflixStock);
    console.log(googleStock);

}

function getToneOfArticle(articlesTextForWatson, buttonId) {
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
          displayResultFromWatson(response, buttonId);
      })
}

function getNewsArticles(userSearchQuery, buttonId) {
    var searchQuery = 'q=' + userSearchQuery;
    var sources = '&sources=' + 'the-wall-street-journal,bloomberg,cnbc,the-verge,wired';
    var apiKey = '&apiKey=' + newsAPIKey;
    var queryURL = 'https://newsapi.org/v2/everything?' + searchQuery + sources + apiKey;
    
    var articleDescriptionArray = []

    $.ajax({
        url: queryURL,
        method: 'GET'
      })
        .then(function(response) {
            response.articles.forEach(function(element) {
               var databaseRef = database.ref(userSearchQuery).push({
                    title: element.title,
                    URL: element.url,
                    description: element.description
                });
                var entryKey = databaseRef.getKey();
                console.log(entryKey , "entryKey")
                articleDescriptionArray.push(element.description);
            });

            articlesTextForWatson = articleDescriptionArray.join(",");
            
            $("#watson-analysis").on("click", function() {
                database.ref(userSearchQuery).on("child_added" , function(childSnapshot) {
                    console.log("exists")
                })
            })

            getToneOfArticle(articlesTextForWatson, buttonId);
    });
}

// AJAX REQUESTS ABOVE
// FIREBASE CONFIG BELOW

var userSearchDatabaseConfig = {
    apiKey: "AIzaSyBBXXCcOQHTChGULdlDwY4JK7545B_A1XI",
    authDomain: "marketwatchapp-35777.firebaseapp.com",
    databaseURL: "https://marketwatchapp-35777.firebaseio.com",
    projectId: "marketwatchapp-35777",
    storageBucket: "marketwatchapp-35777.appspot.com",
    messagingSenderId: "593066949760"
  };

  firebase.initializeApp(userSearchDatabaseConfig);

  var database = firebase.database();

// FIREBASE CONFIG ABOVE
// CALLING FUNCTION BELOW

$('#analyze-btn').on('click', function() {
    var tickerSymbol= $('#tickerSymbol').val().trim();
    var buttonId = $(this).attr('id');
    analyzeTickerSymbol(tickerSymbol, buttonId);

});

$('#ibmWatson-btn').on('click', function() {
    var buttonId = $(this).attr('id');
    faangAnalysis(buttonId);
});
