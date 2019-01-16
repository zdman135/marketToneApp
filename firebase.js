//Set up Firebase config
console.log("testing our file link")


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

  var testPush = database.ref().push({
    test: "test data"
  })

  var pushKey = testPush.getKey()
  console.log(pushKey , "pushKey")

  database.ref().on("child_added" , function(childSnapshot) {
    console.log(childSnapshot.val().test , "childsnapshot.test")

  });


  // Pushing relevant fields from newsAPI response to Firebase
  function firebaseNewsPush(newsResponse) {
    console.log(newsResponse , "newsResponse inside firebaseNewsPush function")
    database.ref().push({
      title: newsResponse.url,
      URL: newsResponse.url,
      description: newsResponse.description,

    })
  }

// Pushing relevant fields from Watson Tone Analyzer respnse to Firebase
  function firebaseWatsonPush(watsonResponse) {
    console.log(watsonResponse , "watsonResponse inside firebaseWatsonPush function")
    database.ref().push({
      tonesObject: watsonResponse.document_tone
    })
  }

