//Set up Firebase config
console.log("testing our file link")


var firebase = require('firebase');
var app = firebase.initializeApp({
  apiKey: "AIzaSyBBXXCcOQHTChGULdlDwY4JK7545B_A1XI",
  authDomain: "marketwatchapp-35777.firebaseapp.com",
  databaseURL: "https://marketwatchapp-35777.firebaseio.com",
  projectId: "marketwatchapp-35777",
  storageBucket: "marketwatchapp-35777.appspot.com",
  messagingSenderId: "593066949760"
});

  var database = firebase.database()

  database.ref().on("child_added" , function(childSnapshot) {
    console.log(childSnapshot , "childSnapshot")
  });
  

  // NODE CONFIGURE CODE

  const http = require('http');

  const hostname = '127.0.0.1';
  const port = 3000;
  
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // res.end('Hello World\n');
  });
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


// INTRINO SDK CODE

var intrinioSDK = require('intrinio-sdk');
const util = require('util')
 
intrinioSDK.ApiClient.instance.authentications['ApiKeyAuth'].apiKey = "OjYwYjU0ZGM3NWM3MTFmYTMwZGU1NTMzYTNjMjk1NjZl";
 
var companyAPI = new intrinioSDK.CompanyApi()
 
companyAPI.getAllCompanies().then(function(data) {
  console.log(util.inspect(data, false, null, true));
}, function(error) {
  console.error(error);
});