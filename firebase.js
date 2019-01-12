//Set up Firebase config
console.log("testing our file link")


var firebaseConfig = {
    apiKey: "AIzaSyBBXXCcOQHTChGULdlDwY4JK7545B_A1XI",
    authDomain: "marketwatchapp-35777.firebaseapp.com",
    databaseURL: "https://marketwatchapp-35777.firebaseio.com",
    projectId: "marketwatchapp-35777",
    storageBucket: "marketwatchapp-35777.appspot.com",
    messagingSenderId: "593066949760"
  };

  firebase.initializeApp(firebaseConfig);

  var database = firebase.database()



  database.ref().on("child_added" , function(childSnapshot) {
    console.log(childSnapshot , "childSnapshot")
  });


  // Pushing relevant fields from newsAPI response to Firebase
  function firebaseNewsPush(newsResponse) {
    database.ref().push({
      title: newsResponse.URL,
      URL: newsResponse.URL,
      description: newsResponse.Description,

    })
  }

// Pushing relevant fields from Watson Tone Analyzer respnse to Firebase
  function firebaseWatsonPush(watsonResponse) {
    database.ref().push({
      tonesObject: watsonResponse.Tones
    })
  }


  // function firebaseAlphaPush(alphaResponse) {
  //   database.ref().push({
  //     symbol: alphaResponse[ "Global Quote" ][ "01. symbol"],
  //     changePercent: alphaResponse[ "Global Quote" ][ "10. change percent"],
  //   })

  // }

