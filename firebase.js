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