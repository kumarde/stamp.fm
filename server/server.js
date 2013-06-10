//need to find some way to count in the node.js D;
var express = require('express')
  , engine = require('ejs-locals')
  , app = express();
app.use(express.bodyParser());

var fs = require('fs');

var db = require('mongojs').connect("stampfm", ["music", "users", "counters"]);
var TestModule =  require('./scripts/testModule.js').TestModule;
var AuditionModule = require('./scripts/AuditionModule.js').AuditionModule;
//if collection exists, store variable count == 0;
var count = 0;
var c = 0;
var sorted;
db.music.count(function(err, count){
  if(count == 0){
    counter = 0;
  }
  else if(count != 0){
    counter = count;
  }
})

db.music.find().sort({_id:1}, function(err, rest){
  sorted = rest;
  //console.log(sorted[5].name);
});

app.engine('ejs', engine);// use ejs-locals for all ejs templates
app.set('views',__dirname + '/views');//set views directory
app.set('view engine', 'ejs'); // so you can render('index')
app.use(express.bodyParser());

var testModule = new TestModule;
var auditionModule = new AuditionModule;

app.get('/newView', function(req, res, next){
      res.render('newview', { v1id: sorted[c]._id, v2id: sorted[c+1]._id} );
      auditionModule.UpdateDB(c, function(inc, newsort){
        if(inc) c+=2;
        else{
          sorted = newsort;
          c = 0;
        }
      });
});


app.get('/', function(req, res,next) {// get for index page,

  testModule.ReadMessage(function(error,data){
	console.log(data);
  });
  res.render('index', { title: testModule.message })//render index.ejs, send to <%=title%>
});


//get for needed files
app.get('/stylesheets/style.css', function(req,res,next){
  var stream = fs.createReadStream(__dirname + '/stylesheets/style.css').pipe(res);

  //res.sendfile('stylesheets/style.css');
});
app.get('/stylesheets/main.css', function(req,res,next){
  var stream2 = fs.createReadStream(__dirname+ '/stylesheets/main.css').pipe(res);
});
app.get('/scripts/main.js', function(req,res,next){
  var stream3 = fs.createReadStream(__dirname + '/scripts/main.js').pipe(res);
});
app.get('/include/jquery.ejs.js', function(req,res,next){
  var stream4 = fs.createReadStream(__dirname + '/include/jquery.ejs.js').pipe(res);
});
app.get('/include/ejs_production.js', function(req,res,next){
  var stream5 = fs.createReadStream(__dirname + '/include/ejs_production.js').pipe(res);
});
app.get('/include/views.js', function(req,res,next){
  var stream6 = fs.createReadStream(__direname + '/include/views.js').pipe(res);
});
app.get('/images/stampLogo.png', function(req,res,next){
  var stream7 = fs.createReadStream(__dirname + '/images/stampLogo.png').pipe(res);
});
app.get('/images/treble.png', function(req,res,next){
  var stream8 = fs.createReadStream(__dirname + '/images/treble.png').pipe(res);
});
app.get('/videos/video.mp4', function(req,res,next){
  var stream9 = fs.createReadStream(__dirname +'/videos/video.mp4');
      stream9.pipe(res);
});
app.get('/video-js/video-js.css', function(req,res,next){
  var stream8 = fs.createReadStream(__dirname + '/video-js/video-js.css').pipe(res);
});
app.get('/video-js/video.js', function(req,res,next){
  var stream8 = fs.createReadStream(__dirname + '/video-js/video.js').pipe(res);
});



app.listen(8888);//listen on port 8888, e.g. localhost:8888/


app.post('/save', express.bodyParser(), function(req, res){
  //added a comment
  db.music.save({_id: counter++, name:req.body.name, songTitle:req.body.songTitle, votes:0, views:0});
    console.log(req.body.name);
    console.log(req.body.songTitle);
});

app.post('/vote', function(req, res){
    console.log(req.body);
    db.music.update({_id:parseInt(req.body.vid)}, {$inc:{votes:1}}, function(err, count){
      res.send({v1id: sorted[c]._id, v2id: sorted[c+1]._id});
      auditionModule.UpdateDB(c, function(inc, newsort){
        if(inc) c += 2;
        else{
          sorted = newsort;
          c = 0;
        }
      })


      //console.log("updated");
      //res.send({v1id: sorted[c]._id, v2id: sorted[c+1]._id});
      /*db.music.update({_id:sorted[c]._id}, {$inc:{views:1}}, function(err, count){

      });
      db.music.update({_id:sorted[c+1]._id}, {$inc:{views:1}}, function(err, count){

      });
      //increment the two
      c += 2;
      if(c >= counter){
        db.music.find().sort({votes:-1}, function(err, rest){
          sorted = rest;
          console.log(sorted);
          c = 0;
        })
      }
      else if(c+1 == counter){
        db.music.update({_id:sorted[c]._id}, {$inc:{views:1}}, function(err,count){
            db.music.find().sort({votes:-1}, function(err, rest){
            sorted = rest;
            console.log(sorted);
            c = 0;
          })
        })
      }*/
    });
})

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