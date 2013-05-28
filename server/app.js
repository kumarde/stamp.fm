var express = require('express');
var app = express();
var fs = require('fs');

var db = require('mongojs').connect("db", ["users", "reports"]);

// Configuration
app.configure( function() {
});

// Routes
app.get('/save', function(req, res) {

db.users.save({name: "jon", number: "0", sex: "female"}, function(err,saved){
	if (err || !saved) console.log("User not saved");
	else console.log("User saved");
});

res.end("Save");

});

app.get('/load', function(req, res) {
fs.readFile('load.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading /load');
    }
	
    res.writeHead(200);
    res.end(data);
  });
  
db.users.find({sex: "female"}, function(err, users) {
  if( err || !users) console.log("No female users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});

res.end("Load");

});

app.listen(8080);