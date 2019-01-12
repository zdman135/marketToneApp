//  constants
var watstonAPIKeY = btoa('apikey:4183-tWTIj-xTstT8XVc4uQqRgJfZhHOLiJb5U8PvrxX');
var newsAPIKey = '860ca082a90441caa0446fdf630130da';
var placeHolderObject = {};

var articlesTextForWatson;

function getToneOfArticle(placeHolderObject) {
    $.ajax({
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + watstonAPIKeY,
            'Content-Type':'application/json'
        },
        url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21',
        data: JSON.stringify(
            {"text": "Jeanne Augier's death brings to a close an era of glitz and glamour on the French Riviera. Google is looking into building a $600 million data center in central Minnesota that would be powered by two wind farms. Board members of Alphabet, the parent company of tech giant Google, are being sued by shareholders over multi-million payouts to top executives investigated for sexual harassment at the Silicon Valley behemoth. Fears over sensitive US military data in commercial cloud. The online retailer edges past Microsoft, but its total value remains below last year's $1tn. An investigation reveals other technology companies were not always aware how much access they had been given. Google and Facebook's ad networks placed promotions for major brands before apps were banned. The latest Mary Poppins film has been a hit at the box office but what money lessons can we take from the film franchise? More than 750 people sign a petition accusing discount site boss Josh Rathour of inappropriate behaviour. The Dow Jones and the Nasdaq recorded the biggest falls since 2008, led by tech giants."}
        ),
        dataType: 'json'
      }).then(function(response) {
        console.log(response);
      
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
    });
}
