//  app related constants
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

// firebase related
var searchedQuery = "";
var keyHolder = [];
var userSearchDatabaseConfig = {
    apiKey: "AIzaSyBBXXCcOQHTChGULdlDwY4JK7545B_A1XI",
    authDomain: "marketwatchapp-35777.firebaseapp.com",
    databaseURL: "https://marketwatchapp-35777.firebaseio.com",
    projectId: "marketwatchapp-35777",
    storageBucket: "marketwatchapp-35777.appspot.com",
    messagingSenderId: "593066949760"
  };


// functions related to app logic
function analyzeTickerSymbol(tickerSymbol, buttonId) {
    getNewsArticles(tickerSymbol, buttonId);
}

function faangAnalysis(buttonId) {
    searchedQuery = "facebook apple netflix alphabet";
    getNewsArticles("facebook apple netflix alphabet", buttonId)
}

function displayResultFromWatson(response, buttonId) {
    var toneResponse = response.document_tone.tones
    var tickerTone = toneResponse[Math.floor(Math.random() * toneResponse.length)].tone_id;
    console.log(tickerTone, 'this is ticker tone');
    console.log(buttonId);
    watsonToneMapper[tickerTone]

    switch(watsonToneMapper[tickerTone]) {
        case "buy":
            $('#watson-result').html('<img src="assets/images/buy-smiley.jpg">')
            break;
        case "sell":
            $('#watson-result').html('<img src="assets/images/sell-smiley.jpg">')
            break;
        case "hold":
            $('#watson-result').html('<img src="assets/images/hold-smiley.png">')
            break;
        default:
            $('#watson-result').html('<img src="assets/images/hold-smiley.png">')
        }
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
          console.log('watson response', response);
          displayResultFromWatson(response, buttonId);
      })
}

function getNewsArticles(userSearchQuery, buttonId) {
    var searchQuery = 'q=' + userSearchQuery;
    var sources = '&sources=' + 'the-wall-street-journal,bloomberg,cnbc,the-verge,wired';
    var apiKey = '&apiKey=' + newsAPIKey;
    var queryURL = 'https://newsapi.org/v2/everything?' + searchQuery + sources + apiKey;
    
    var articleDescriptionArray = [];

    $.ajax({
        url: queryURL,
        method: 'GET'
      })
        .then(function(response) {
                response.articles.forEach(function(element) {
                    var databaseRef = database.ref(userSearchQuery).push()
                    var entryKey = databaseRef.getKey();
                    keyHolder.push(entryKey)
                    console.log(entryKey , "entryKey")
                    databaseRef.set({
                        title: element.title,
                        URL: element.url,
                        description: element.description,
                        key: entryKey
                    });
                });

                articleDescriptionArray = [];
                response.articles.forEach(function(element) {
                    articleDescriptionArray.push(element.description);
                });
    
                articlesTextForWatson = articleDescriptionArray.join(",");
                getToneOfArticle(articlesTextForWatson, buttonId);
    });
}


// firebase related functions
function showNewsArticles(userSearchQuery) {
    var headArray = ["Title" , "Description" , "Link"]

    var newTable = $('<table id="results-table" class="striped">')
    var newThead = $("<thead>")
    var newBody = $("<tbody>")
    var headRow = $("<tr>")

    // need to separate this into a new function, to only make one table then invoke function to fill it 
    headArray.forEach(function(element) {
        var newHead = $("<th>")
        newHead.text(element) 
        headRow.append(newHead)
    })
    newThead.append(headRow)
    newTable.append(newThead)
    newBody.addClass("articleBody")
    newTable.append(newBody)

    keyHolder.forEach(function(element) {
        addArticleToTable(element , userSearchQuery)
    })

    // $(".articleBody").append(newBody) dont think needed twice if done in addArticleToTable
    $("#watston-analysis-result").append(newTable)
}

function addArticleToTable(firebaseKey , userSearchQuery) {

    database.ref(userSearchQuery + "/" + firebaseKey).on("value" , function(snapshot) { //element added for use when put in foreach
        console.log(snapshot.val() , "ss") //working but need to add key from keyHolder with foreach to ref to access data
        var snapshotVal = snapshot.val()
        var valTitle = snapshotVal.title
        var valDescription = snapshotVal.description
        var valURL = snapshotVal.URL
        // var valURL = database.ref(userSearchQuery + "/" + firebaseKey).val().URL
        console.log(valTitle , "valTitle database ref test")
           
        //button to hide actual URL text for cleanliness
        var buttonURL = $("<a>")
        buttonURL.attr("href" , valURL)
        buttonURL.text("Link to Article")
        buttonURL.data("fbkey" , firebaseKey)

        var dataArray = [valTitle , valDescription , buttonURL]

        var bodyRow = $("<tr>")


        dataArray.forEach(function(element) {
            var newData = $("<td>")
            newData.html(element)
            bodyRow.append(newData)

        })
        console.log($('.articleBody') , "aB");
        $('.articleBody').append(bodyRow)
    }); 
}

firebase.initializeApp(userSearchDatabaseConfig);
var database = firebase.database();

$('#analyze-btn').on('click', function() {
    var tickerSymbol= $('#tickerSymbol').val().trim();
    searchedQuery = tickerSymbol;
    var buttonId = $(this).attr('id');
    analyzeTickerSymbol(tickerSymbol, buttonId);
});

$('#ibmWatson-btn').on('click', function() {
    var buttonId = $(this).attr('id');
    faangAnalysis(buttonId);
});

$("#watson-analysis").on("click", function() {
    if (searchedQuery === "") {
        console.log("no search was done");
    } else {
        showNewsArticles(searchedQuery)
    }

})
