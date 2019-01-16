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

function analyzeTickerSymbol(tickerSymbol) {
    getNewsArticles(tickerSymbol);
}

function displayResultFromWatson(response) {
    var tickerTone = response.document_tone.tones[0].tone_id;
    console.log(tickerTone);
    watsonToneMapper[tickerTone]

    switch(watsonToneMapper[tickerTone]) {
        case "buy":
            $('#watson-result-picture').html('<img src="assets/images/buy-smiley.jpg">')
          break;
        case "sell":
            console.log('it is selling');
          break;
        case "hold":
            console.log('it is holding');
          break;
        default:
            console.log('it is a hold');
      }
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
          displayResultFromWatson(response);
      })
}

function getNewsArticles(userSearchQuery) {
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
                var databaseRef = database.ref(userSearchQuery).push()
                var entryKey = databaseRef.getKey();
                console.log(entryKey , "entryKey")
                databaseRef.set({
                    title: element.title,
                    URL: element.url,
                    description: element.description,
                    key: entryKey
                });
                articleDescriptionArray.push(element.description);
            });

            articlesTextForWatson = articleDescriptionArray.join(",");
            getToneOfArticle(articlesTextForWatson);
            
            $("#watson-analysis").on("click", function() {
                database.ref(userSearchQuery).on("child_added" , function(childSnapshot) {
                    console.log("exists")
                })
            })

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
    analyzeTickerSymbol(tickerSymbol);

});



