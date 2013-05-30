var express = require('express')
  , engine = require('ejs-locals')
  , app = express();

var db = require('mongojs').connect("db", ["music", "users"]);
var count = db.music.stats().count;
var TestModule =  require('./scripts/testModule.js').TestModule;
var AuditionModule = require('./scripts/AuditionModule.js').AuditionModule;
  
app.engine('ejs', engine);// use ejs-locals for all ejs templates
app.set('views',__dirname + '/views');//set views directory
app.set('view engine', 'ejs'); // so you can render('index')
app.use(express.bodyParser());

var testModule = new TestModule;
var auditionModule = new AuditionModule;

app.get('/', function(req, res,next) {// get for index page,

  testModule.ReadMessage(function(error,data){
	console.log(data);
  });
  res.render('index', { title: testModule.message })//render index.ejs, send to <%=title%>
  
});


//get for needed files
app.get('/stylesheets/style.css', function(req,res,next){
  res.sendfile('stylesheets/style.css');
});
app.get('/scripts/main.js', function(req,res,next){
  res.sendfile('scripts/main.js');
});
app.get('/include/jquery.ejs.js', function(req,res,next){
  res.sendfile('include/jquery.ejs.js');
});
app.get('/include/ejs_production.js', function(req,res,next){
  res.sendfile('include/ejs_production.js');
});
app.get('/include/views.js', function(req,res,next){
  res.sendfile('include/views.js');
});


app.listen(8888);//listen on port 8888, e.g. localhost:8888/


app.post('/save', express.bodyParser(), function(req, res){
  //added a comment
  auditionModule.Save(req, function(err, saved) {
    console.log(saved.body.name);
    console.log(saved.body.songTitle);

  });
});

/*app.post('/ajax', express.bodyParser(), function (req, res){
  db.music.save({})


/*db.votes.save({votes: 0}, function(err,saved){
	if (err || !saved) console.log("Vote not saved");
	else {
	console.log("Vote Saved"); 
	AuditionModule.prototype.UpdateDB(function(error,votes) {
	if ( error ) console.log("error");
	else console.log(votes[0]);
  console.log(votes[0].votes);
	});
	}
});
   console.log('AJAX post recieved');
   //res.redirect('/');
   var newMessage = "Server response to AJAX";
	
	res.send({message: newMessage});
});*/