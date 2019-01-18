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
var keyHolder = []

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
            // $('#watson-result-picture').html('<img src="assets/images/buy-smiley.jpg">')
            console.log("it is buy")
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
                keyHolder.push(entryKey)
                console.log(entryKey , "entryKey")
                databaseRef.set({
                    title: element.title,
                    URL: element.url,
                    description: element.description,
                    key: entryKey
                });
                articleDescriptionArray.push(element.description);
            });
            console.log(keyHolder , "keyHolder after keyPush")
            articlesTextForWatson = articleDescriptionArray.join(",");
            getToneOfArticle(articlesTextForWatson);
            
            $("#analyze-btn").on("click", function() { //replace analyze-btn with watson-analysis
                console.log("clicked")
                showNewsArticles(userSearchQuery)
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
//Table Creation Function
function showNewsArticles(userSearchQuery) {
   

    var headArray = ["Title" , "Description" , "Link"]

    var newTable = $("<table>")
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
    $("#watson-result-picture").append(newTable)
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
        // buttonURL.addClass("waves-effect")
        // buttonURL.addClass("waves-light")
        // buttonURL.addClass("btn")
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

// CALLING FUNCTION BELOW

$('#analyze-btn').on('click', function() {
    var tickerSymbol= $('#tickerSymbol').val().trim();
    analyzeTickerSymbol(tickerSymbol);

});
