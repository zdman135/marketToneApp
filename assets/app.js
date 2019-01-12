
// Initalize Variable template to be aligned with the html
var searchTerm;
var recordNum;
var startYear;
var endYear;
var articleArray;


$(document).on("click", "#search-btn", function (event) {
    event.preventDefault();
    search();
})

function search() {
    searchTerm = $("#search-term").val();
    recordNum = $("#select-number").val();
    // startYear = $("#start-year").val();
    // endYear = $("#end-year").val();

    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=6f875a93bea94a66ada56d27a190dc28&q=" + searchTerm; 


    $.ajax({
        url: queryURL,
        method: "GET"
    }) .then(function(response) {
        articleArray = response.response.docs;

        for (var i = 0; i < articleArray.length; i++) {
            var article = $("<div>");
            var header = $("<h2>").text(articleArray[i].headline.main);
            var link = $("<a>").attr("href", articleArray[i].web_url);

            link.append(header);
            $(article).append(link);
            $(".article-list").append(article);

            console.log(articleArray[i]);

        }
    })

}

$(document).on("click", "#clear", function() {

        
})