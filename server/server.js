var flash = require('connect-flash')
  , express = require('express')
  , engine = require('ejs-locals')
  , form  = require('express-form')
  , moment = require('moment')
  , http = require('http')
  , ObjectID = require('mongodb').ObjectID
  , field = form.field 
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , graph = require('fbgraph')
  , fs = require('fs')
  , db = require('mongojs').connect("stampfm", ["profiles", "music", "users", "tournament", "playlists", "ads","temps", "locals"]);

var s3 = require('s3policy');
var myS3Account = new s3('AKIAIZQEDQU7GWKOSZ3A', 'p99SnAR787SfJ2v+FX5gfuKO8KhBWOwZiQP8AdE5');
var mpu = require('knox-mpu');
var S3_KEY = 'AKIAIZQEDQU7GWKOSZ3A';
var S3_SECRET = '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';
var S3_BUCKET = 'data.stamp.fm';
var PIC_BUCKET = 'images.stamp.fm';
var knox = require('knox');
var songs = 0;

  var TestModule =  require('./scripts/testModule.js').TestModule;
  var AuditionModule = require('./scripts/AuditionModule.js').AuditionModule;
  var AccountModule = require('./scripts/AccountModule.js').AccountModule;
  var EmailModule = require('./scripts/EmailModule.js').EmailModule;
  var UploadModule = require('./scripts/UploadModule.js').UploadModule;
  var UserModule = require('./scripts/UserModule.js').UserModule;
  var FeedModule = require('./scripts/FeedModule.js').FeedModule;
  var ElimModule = require('./scripts/ElimModule.js').EliminationModule;

  var testModule = new TestModule;
  var auditionModule = new AuditionModule;
  var accountModule = new AccountModule;
  var emailModule = new EmailModule;
  var uploadModule = new UploadModule;
  var userModule = new UserModule;
  var Feed = new FeedModule;
  var elim = new ElimModule;
  
 db.music.insert({_id:0, name: "Don't You Worry Child Cover", artistID: "51eef88e5e61878754000018", artistName: "(Stamp Champ)Dan Henig", explicit: "off", genre: "acoustic", inTourney: "Submitted"}); 
 
 db.ads.insert({_id:"0", name:"Turtle Cell"});

 
/***********************CHECK HOW MANY SONGS THERE ACTUALLY ARE*************************/
db.music.count(function(e, count){
    console.log(count);
    if(count){
      db.music.find().sort({_id: -1}, function(e, o){
        songs = o[0]._id + 1;
      })
    }
    else {
        songs = 0;
    }
});
/**********************ON SERVER STARTUP SONGS WILL BE 0 AND WILL INCREMENT WHENEVER UPDATED**/
var flag = false; 

var client = knox.createClient({
    key: S3_KEY,
    secret: S3_SECRET,
    bucket: S3_BUCKET
});

var picClient = knox.createClient({
    key: S3_KEY,
    secret: S3_SECRET,
    bucket: PIC_BUCKET
});

var app = express();
app.configure(function(){
    app.set('port', process.env.PORT || 8888);
    app.use(express.static(__dirname + '/stylesheets'));
    app.use(express.static(__dirname + '/images'));
    app.use(express.static(__dirname + '/video-js'));
    app.use(express.static(__dirname + '/videos'));
    app.use(express.static(__dirname + '/scripts'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-duper-secret-secret'}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.engine('ejs', engine);// use ejs-locals for all ejs templates
    app.set('views',__dirname + '/views');//set views directory
    app.set('view engine', 'ejs'); // so you can render('index')
    app.engine('html', require('ejs').renderFile);
    app.use(app.router);

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        db.users.find({_id: id}, function(err, user){
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: "427362497341922",
        clientSecret: "12e395fc0c5f42b67e58f60894bf66a2",
        callbackURL: "http://www.stamp.fm/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done){
            graph.setAccessToken(accessToken);
            var query = 'SELECT uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1';
            graph.fql(query, function(err, res){
              for(var id in res.data){
                db.users.findOne({_id: res.data[id].uid}, function(e, o){
                  if(e) console.log(e);
                  if(o){
                    Feed.follow(profile.id.toString(), res.data[id].uid.toString(), function(data){});
                  }
                })
              }
            });
            db.users.findOne({_id: profile.id}, function(err, user){
                if(err) return done(err);
                else if(user == null){
                    db.users.insert({name:profile._json.name,pass: "4c3alfae7878797x97388xx838skdfj222", _id:profile.id, email:profile._json.email, date:moment().format('MMMM Do YYYY, h:mm:ss a')}, function(e, userprof){
                       db.profiles.save({url: "", _id: profile.id, name: profile._json.name, location: "Click to change Location", bio: "Click to change Tagline", facebook: profile._json.link, twitter: "", following: [], followers: [], shared: [], gender: profile.gender, isNew: "false"});
                       return done(null, userprof[0]);
                    });
                }
                else{
                  return done(null, user);
                }
            });
        }
    ));
});

/*****************algorithm*****************/
//if collection exists, store variable count == 0;
var counter = 0;
var c = 0;
var sorted;

var cPop = 0;
var totalPop;
var pop_array;
var temp;

app.get('/elim', function(req, res){
	if (req.session.user == null && req.user == null && req.session.temp == null) {
		res.redirect('/');
	}else {
		var dbt = db.profiles;
		if (req.session.temp == null ){

			if(req.session.user == null){
				id = req.user[0]._id;
			}
			else if(req.user == null){
				if(req.session.user[0] == undefined){
				id = req.session.user._id;
				} else {
					id = req.session.user[0]._id;
				}
			}
		}	
		else {
			id = req.session.temp._id;
			dbt = db.temps;
		}
		
		dbt.findOne({_id:id}, function(e,p){
			if ( e || !p)res.redirect('/');
			if (!p.elim){
  

				elim.initElim("Rap", function(array, c){
					rap_array = array;
					totalRap = rap_array.length;
					cRap = c;
					temp = c;

					console.log(rap_array);
					db.tournament.findOne({_id: rap_array[temp]._id}, function(e, o){
						db.profiles.findOne({_id: o.artistID}, function(e, user){
							db.tournament.findOne({_id: rap_array[temp+1]._id}, function(e, o2){
								db.profiles.findOne({_id: o2.artistID}, function(e, user2){
									var e = {v1id: rap_array[temp]._id, v2id: rap_array[temp+1]._id, v1name: o.name, v2name: o2.name, v1artist: o.artistName, v2artist:o2.artistName, v1v: o.votes, v2v:o2.votes};
									dbt.update({_id: id},{$set: {elim:e}});
									res.render('elim', {imgid: "0", v1id: e.v1id, v2id:e.v2id, song1: o.name, song2: o2.name, user1: o.artistName, user2: o2.artistName, votes1: o.votes, votes2: o2.votes});

								});
							});
						});
					});
					elim.updateDB("Rap", cRap, rap_array, totalRap, function(inc, newArray){
						console.log("C: :" + cRap + " total: " + totalRap);
						if(inc == 1){
							cRap += 2;
							db.locals.update({_id: "Rap"}, {$set: {c: cRap}});
						}
						else{
							rap_array = newArray;
							cRap = 0;
							db.locals.update({_id: "Rap"}, {$set: {c: cRap, array: rap_array}});
						}
					});
				});
			}else{
				res.render('elim', {imgid: "0", v1id: p.elim.v1id, v2id:p.elim.v2id, song1: p.elim.v1name, song2: p.elim.v2name, user1: p.elim.v1artist, user2: p.elim.v2artist, votes1: p.elim.v1v, votes2: p.elim.v2v});
			}
		});
	}
});

app.post('/testvote', function(req, res){
	if (req.session.user == null && req.user == null && req.session.temp == null) {
		res.redirect('/');
	}
	else {
		var dbt = db.profiles;
		if (req.session.temp == null ){
			if(req.session.user == null){
				id = req.user[0]._id;
			}
			else if(req.user == null){	
				if(req.session.user[0] == undefined){
					id = req.session.user._id;
				} else {
					id = req.session.user[0]._id;
				}
			}
		}
		else {
			id = req.session.temp._id;
			dbt = db.temps;
		}

		dbt.findOne({_id:id}, function(e,p){
			if (req.body.vid == p.elim.v1id || req.body.vid == p.elim.v2id){
				dbt.update({_id:id},{$unset:{elim:""}});
				db.tournament.update({_id: req.body.vid}, {$inc: {votes:1}});
				res.send(204);

			}else res.send(204);
		});
	}
});

app.post('/playNext', function(req, res){
	if (req.session.user == null && req.user == null && req.session.temp == null) {
		res.redirect('/');
	}
	else {
		var dbt = db.profiles;
		if (req.session.temp == null ){

			if(req.session.user == null){
				id = req.user[0]._id;
			}
			else if(req.user == null){
				if(req.session.user[0] == undefined){
					id = req.session.user._id;
				} else {
					id = req.session.user[0]._id;
				}
			}
		}
		else {
			id = req.session.temp._id;
			dbt = db.temps;
		}

		dbt.findOne({_id:id}, function(e,p){
			if (!p.elim ){
				var e = {v1id: rap_array[cRap]._id, v2id: rap_array[cRap+1]._id, v1name: rap_array[cRap].name, v2name: rap_array[cRap+1].name, v1artist: rap_array[cRap].artistName, v2artist: rap_array[cRap+1].artistName, v1v: rap_array[cRap].votes, v2v: rap_array[cRap+1].votes};
				dbt.update({_id:id},{$set:{elim:e}});
				res.send({v1id: rap_array[cRap]._id, v2id: rap_array[cRap+1]._id, votes1: rap_array[cRap].votes, votes2: rap_array[cRap+1].votes, s1:rap_array[cRap].name , s2:rap_array[cRap+1].name, a1: rap_array[cRap].artistName, a2: rap_array[cRap+1].artistName});
				elim.updateDB("Rap", cRap, rap_array, totalRap, function(inc, newArray){
				if(inc){
					cRap += 2;
					db.locals.update({_id: "Rap"}, {$set: {c: cRap}});
				}
				else{
					rap_array = newArray;
					cRap = 0;
					db.locals.update({_id: "Rap"}, {$set: {array: rap_array, c: 0}});
				}
				});
			}else {
				res.send({v1id: p.elim.v1id, v2id: p.elim.v2id, votes1: p.elim.v1v, votes2: p.elim.v2v, s1:p.elim.v1name , s2:p.elim.v2name, a1: p.elim.v1artist, a2: p.elim.v2artist});

			}
		});
	}
});

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
});

app.post('/namesearch', function(req,res){
    db.users.find({name: { $regex: new RegExp('^'+req.body.search,"i")}},function(err,o){
        if (err || !o)res.send({error:"Cannot find"});
        else res.send(o);
    });
});

app.post('/bandsearch', function(req,res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
	if(req.session.user == null){
        id = req.user[0]._id;
    }
    else if(req.user == null){
		if(req.session.user[0] == undefined){
		id = req.session.user._id;
		} else {
			id = req.session.user[0]._id;
		}
	}
    db.profiles.find({name: { $regex: new RegExp('^'+req.body.search,"i")}},function(err,o){
        if (err || !o)res.send({error:"Cannot find"});
        else res.send({data:o, id:id});
    });
}
});

app.get('/feed', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
		else res.render('feed');
});


app.get('/users', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
		else res.render('users');
});

app.post('/users', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
		else {
			db.users.find(function(err,docs){
				if (err || !docs)res.send({error: "Could not lookup db"});
				else res.send(docs);
			});
		}
});

app.post('/addfeed', function(req, res){

	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
        if(req.session.user == null){
                    id = req.user[0]._id;
                 }
                 else if(req.user == null){
                    if(req.session.user[0] == undefined){
                        id = req.session.user._id;
                    } else {
                        id = req.session.user[0]._id;
                    }
                 }
		  Feed.add(id, req.body.type, req.body.data, function(data) {
			 if (data == false)res.send({error: "error"});
			 res.send(data);
		});
	}
});

app.post('/feed', function(req, res){

	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
if(req.session.user == null){
                    id = req.user[0]._id;
                 }
                 else if(req.user == null){
                    if(req.session.user[0] == undefined){
                        id = req.session.user._id;
                    } else {
                        id = req.session.user[0]._id;
                    }
                 }
		Feed.load(req.body.index, function(data) {
			if ( data == false )res.send({error: "Up to date"});
			else res.send(data);
		});
	}
});

app.post('/unfollow', function(req, res){
    if (req.session.user == null && req.user == null) {
    res.send({redirect:'/'});
  }
  else{
    if(req.session.user == null){
        id = req.user[0]._id;
    }
    else if(req.user == null){
      if(req.session.user[0] == undefined){
        id = req.session.user._id;
      } else {
        id = req.session.user[0]._id;
      }
    }
    Feed.unfollow(id, req.body.id, function(data){
      res.send(204);
    });
  }
});

app.post('/follow', function(req,res){
	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
		if(req.session.user == null){
        id = req.user[0]._id;
    }
    else if(req.user == null){
			if(req.session.user[0] == undefined){
				id = req.session.user._id;
			} else {
				id = req.session.user[0]._id;
			}
    }
	Feed.follow(id, req.body.id, function(data) {
		if ( data != false)res.send(204);
		else res.send(204);
	});
	db.profiles.findOne({_id:req.body.id}, function(err,data){
		if (err || !data)console.log("failed");
		else {
		Feed.share(id, {type: 'follow', id: req.body.id, name: data.name}, function(data){
				if (data == false)console.log("Share failed");
			});
			}
	});
	}
});

app.post('/followers', function(req,res) {
	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
if(req.session.user == null){
                    id = req.user[0]._id;
                 }
                 else if(req.user == null){
                    if(req.session.user[0] == undefined){
                        id = req.session.user._id;
                    } else {
                        id = req.session.user[0]._id;
                    }
                 }
				 
	var nid;
	if (req.body.id == "self")nid = id;
	else nid = req.body.id;
	Feed.followers(nid, function(data){
		res.send(data);
	});
	}
});

app.post('/following', function(req,res) {
	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
if(req.session.user == null){
                    id = req.user[0]._id;
                 }
                 else if(req.user == null){
                    if(req.session.user[0] == undefined){
                        id = req.session.user._id;
                    } else {
                        id = req.session.user[0]._id;
                    }
                 }
	var nid;
	if (req.body.id == "self")nid = id;
	else nid = req.body.id;
	
	Feed.following(nid, function(data){
		res.send(data);
	});
	}
});

app.post('/profile/data', function(req,res) {
	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/'});
	}
	else{
		Feed.lookup(req.body.id,function(data){
			res.send(data);
		});
	}
});


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
//get for needed files
app.get('/stylesheets/style.css', function(req,res,next){
  var stream = fs.createReadStream(__dirname + '/stylesheets/style.css').pipe(res);
});
app.get('/stylesheets/main.css', function(req,res,next){
  var stream2 = fs.createReadStream(__dirname+ '/stylesheets/main.css').pipe(res);
});
app.get('/scripts/main.js', function(req,res,next){
  var stream3 = fs.createReadStream(__dirname + '/scripts/main.js').pipe(res);
});
app.get('/scripts/FormValidation.js', function(req, res){
  var stream7 = fs.createReadStream(__dirname + '/scripts/FormValidation.js').pipe(res);
})
app.get('/include/jquery.ejs.js', function(req,res,next){
  var stream4 = fs.createReadStream(__dirname + '/include/jquery.ejs.js').pipe(res);
});
app.get('/include/ejs_production.js', function(req,res,next){
  var stream5 = fs.createReadStream(__dirname + '/include/ejs_production.js').pipe(res);
});
app.get('/include/views.js', function(req,res,next){
  var stream6 = fs.createReadStream(__direname + '/include/views.js').pipe(res);
});

app.post('/vote', function(req, res){
    db.music.update({_id:parseInt(req.body.vid)}, {$inc:{votes:1}}, function(err, count){
      res.send({v1id: sorted[c]._id, v2id: sorted[c+1]._id});
      auditionModule.UpdateDB(c, function(inc, newsort){
        if(inc) c += 2;
        else{
          sorted = newsort;
          c = 0;
        }
      })
    });
})

/*********************************UPLOAD ROUTES **********************************************/
app.post('/song-upload', function(req, res){
  var id;
  		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
  if(req.session.user == null){
        id = req.user[0]._id;
        name = req.user[0].name;
    }
    else if(req.user == null){
        if(req.session.user[0] == undefined){
                id = req.session.user._id;
                name = req.session.user.name;
        } else {
                id = req.session.user[0]._id;
                name = req.session.user[0].name;
        }
  }
  
	console.log(req.body);
  var temp = songs;
  songs++;
  
	  db.profiles.findOne({_id: id}, function(e,o){
		  
		   db.music.save({_id:temp,name: req.body.name, artistID: id, artistName: o.name, explicit: req.body.explicit, genre: req.body.genre, inTourney: "Submit"});
			  Feed.share(id, {type: 'upload', id: songs, name: req.body.name}, function(data){
				if(data == false) console.log("Share failed.");
			  });
		  var stream = fs.createReadStream(req.files.file.path);
		  upload = new mpu(
			{
			  client: client,
			  objectName: temp.toString(),
			  stream: stream,
			  headers: {"Content-Type": req.files.file.type}
			},
			function(err, obj){
			  console.log(obj);
			  res.redirect('/profile');
			}
			);
		});
	}
});

app.post("/db-upload", function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    var id;
    var name;
    var songID;
    if(req.session.user == null){
        id = req.user[0]._id;
        name = req.user[0].name;
    }
    else if(req.user == null){
        if(req.session.user[0] == undefined){
                id = req.session.user._id;
                name = req.session.user.name;
        } else {
                id = req.session.user[0]._id;
                name = req.session.user[0].name;
        }
    }
}
})


app.post('/tournament', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    console.log(req.body.id);
    var id;
    var name;
    if(req.session.user == null){
        id = req.user[0]._id;
        name = req.user[0].name;
    }
    else if(req.user == null){
        if(req.session.user[0] == undefined){
                id = req.session.user._id;
                name = req.session.user.name;
        } else {
                id = req.session.user[0]._id;
                name = req.session.user[0].name;
        }
    }
	
	db.tournament.findOne({$and: [{genre: req.body.genre}, {artistID: id}]}, function(e, o){
	  if(e) console.log(e);
	  if(o){
		res.send({msg: "no"});
	  }
	  if(!o){
		db.music.update({_id: parseInt(req.body.id)}, {$set: {inTourney: "Submitted"}});
		db.tournament.save({_id: req.body.id, name: req.body.name, genre: req.body.genre, artistID: id, artistName: name, votes: 0, views: 0});
		res.send({msg: "yes"});
	  }
	})
	}
});

/************************************END UPLOAD TO THE TOURNAMENT****************************************/
/**************************************FEEDBACK ROUTES***************************************/
app.post('/feedback', function(req,res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
  var email, name;
    if(req.session.user == null){
      console.log(req.user);
      email = req.user[0].email;
      name = req.user[0].name;
    }
    else if(req.user == null){
        if(req.session.user[0] == undefined){
              email = req.session.user.email;
              name = req.session.user.name;
        } else {
            email = req.session.user[0].email;
            name = req.session.user[0].name;
        }
    }
    var options = emailModule.composeFeedback({
        name: name,
        email: email,
        feedback: req.body.feedback,
        category: req.body.category
    });
    emailModule.dispatchFeedback(options, function(e,m){
        if(e) console.log(e);
    })
    var responseOptions = emailModule.composeResponse({
        name: name,
        email: email
    });
    emailModule.dispatchResponse(responseOptions, function(e,m){
        if(e) console.log(e);
    })
    res.send({msg:"ok"})
	}
});

/*******************************LOGIN STUFF HERE******************************************/
/*FACEBOOK AUTH*/
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email','user_likes', 'user_photos','user_location']}), function(req,res){if (req.session.temp)req.session.temp = null;});
app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {successRedirect: '/create',
                                       failureRedirect: '/login'}));

app.post('/login', function(req, res){
	accountModule.manualLogin(req.body.email, req.body.password, function(e, o){
		if(!o){
            res.send({error: "Error: Username and Password Combination don't match"});
		} else{
			req.session.user = o;
			if (req.session.temp)req.session.temp = null;
			if(req.body.rememberme == 'true'){
				res.cookie('email', o.email, {maxAge: 900000});
				res.cookie('pass', o.pass, {maxAge: 900000});
			}
		  res.send({redirect:'/profile'});
		}
	});
});

app.get('/', function(req, res){
    if(req.session.user || req.user){
        res.redirect('/profile');
    }
	res.render('createAccount', {title: "Signup"});
});

app.post('/', function(req, res){
    var objectId = new ObjectID();
    accountModule.addNewAccount({
        _id     : objectId.valueOf().toString(),
        name    : req.body.name,
        email   : req.body.email,
        pass    : req.body.password
    }, function(e, o, k){
        console.log(o);
        if (e){
            console.log(e);
            res.send({error: "Error: Username already exists"});
        }   else{
            req.session.user = o;
            res.send({redirect:'/create'});
       }
    });
});

app.get('/tos', function(req, res){
      res.render('tos');
})
app.get('/privacy', function(req, res){
      res.render('privacy');
})
app.get('/faq', function(req, res){
      res.render('faq');
})
app.get('/blog', function(req, res){
      res.render('blog');
})

app.get('/forgot', function(req ,res, next){
    res.render('forgot', {title: 'Forgot Password?'});
});

app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.post('/forgot', function(req, res, next){
    accountModule.getAccountByEmail(req.body.email, function(o){
        if(o){
            res.send({msg:'ok'});
            var options = emailModule.composeEmail(o);
            emailModule.dispatchResetPasswordLink(options, function(e, m){
                if(!e){
                    //do nothing
                } else{
                    res.send({msg: 'email-server-error'}, 400);
                    for(k in e) console.log('error : ', k, e[k]);
                }
            });
        }   else{
            res.send({msg:'email-not-found'}, 400);
        }
    });
});

app.get('/reset-password', function(req, res) {
        var email = req.query["e"];
        var passH = req.query["p"];
        accountModule.validateResetLink(email, passH, function(e){
            if (e != 'ok'){
                res.redirect('/');
            } else{
    // save the user's email in a session instead of sending to the client //
                req.session.reset = { email:email, passHash:passH };
                res.render('reset', { title : 'Reset Password' });
            }
        })
    });
    
app.post('/reset-password', function(req, res) {
        var nPass = req.param('pass');
    // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
    // destory the session immediately after retrieving the stored email //
        req.session.destroy();
        accountModule.updatePassword(email, nPass, function(e, o){
            if (o){
                res.send('ok', 200);
            }   else{
                res.send('unable to update password', 400);
            }
        })
    });

app.post('/updateAccount', function(req, res){
  if(req.param('email') != undefined){
    accountModule.updateAccount({
      email   : req.param('email'),
      newEmail: req.param('newEmail'),
      pass    : req.param('pass') 
    }, function(e,o){
      if(e){
        res.send('error-updating-account', 400);
      } else {
        req.session.user = o;
        if(req.cookies.email != undefined && req.cookies.pass != undefined){
          res.cookie('email', o.email, {maxAge: 900000});
          res.cookie('pass', o.pass, {maxAge: 900000});
        }
        res.redirect('/profile');
      }
    });
  }
})
/********************************************LOGIN STUFF DONE*******************************/
/**************************************TIME TO DO PROFILES***********************************/
app.get('/create', function(req, res){
    var name = "";
    var location = "";
    if(req.session.user == null && req.user == null){
        res.redirect('/');
    }
    else{
        var id;
        if(req.session.user == null){
            id = req.user[0]._id;
            name = req.user[0].name;
            graph.get('/'+id+'?fields=location', function(err, resp){
                if(resp.location != undefined){
                    db.profiles.update({_id: id}, {$set: {location: resp.location.name}});
                }
              db.profiles.findOne({_id: id}, function(e, o){
              if(o.isNew != "false") res.redirect('/profile');
              else {
                graph.get('/'+id+'?fields=picture.type(large)', function(e, respo){
                   db.profiles.update({_id: id}, {$set: {url: respo.picture.data.url}});
                   db.profiles.findOne({_id: id}, function(e, o){
                      location = o.location;
                      db.playlists.insert({songID: "0", artistName: "(Stamp Champ)Dan Henig", name: "Don't You Worry Child Cover", artistID: id});
                      res.render('CreateProfile', {name: name, location: location, imgsrc: respo.picture.data.url}); 
                  })
                });
              }
            })
          });
        }
        else if(req.user == null){
           if(req.session.user[0] == undefined){
                id = req.session.user._id;
            } else {
                 id = req.session.user[0]._id;
            }
             db.profiles.save({_id: id, name: "", location: "Click to change Location", bio: "Click to change Tagline", facebook: "", twitter: "", following: [], followers: [], shared: [], gender: ""}, function(e, o){
              db.playlists.insert({songID: "0", artistName: "(Stamp Champ)Dan Henig", name: "Don't You Worry Child", artistID: id}, function(e, o){
		db.users.findOne({_id: id}, function(e, carrier){
			name = carrier.name;
			res.render('CreateProfile', {name: name, location: location, imgsrc: "stampman.png"});
		})
               }); 
             });
        }
    }
});

app.post('/create', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    var id;
    var stream;
    console.log(req.user);
    console.log(req.session.user);
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else {
            id = req.session.user[0]._id;
        }
    }
    if(req.files.picture.size == 0){
      db.profiles.update({_id: id}, {$set: {changedPic: "none"}});
      stream = fs.createReadStream('/home/ec2-user/stamp.fm/server/images/stampman.png');
    }
    else{
      db.profiles.update({_id: id}, {$set: {changedPic: "true"}});
      stream = fs.createReadStream(req.files.picture.path);
    }
    upload = new mpu(
        {
            client: picClient,
            objectName: id.toString(),
            stream: stream
        },
        function(e, o){
                var gender = req.body.gender;
                var birthday = req.param('month')+req.param('day')+req.param('year');
                userModule.updateDB(req.param('name'), req.param('location'), req.param('bio'), req.param('fb'), req.param('twitter'), id, gender, birthday, function(data){
					      res.redirect('/profile');
				});
        }
    );
	}
});

app.get('/view', function(req, res){
    if (req.session.user == null && req.user == null) {
      res.redirect('/');
    }else{
    var pid = req.query["id"];
    if(pid == null){
        res.send('error, you suck');
    }
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else {
            id = req.session.user[0]._id;
        }
    }
    if ( id == pid) res.redirect('/profile');
    var vid = 0;
    var id;
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else {
            id = req.session.user[0]._id;
        }
    }
    db.profiles.findOne({_id: pid}, function(e, profile){
        if(e){
            res.send(e, 400);
        }
        if(profile == null){
            res.send(404);
        }else{
			var follow = 0;
			 if ( profile.followers.indexOf(id) != -1 )follow = 1;
            db.music.find({artistID: pid}, function(e, songs){
                if(e){
                    console.log(e);
                }  else{
                        db.playlists.find({artistID: pid}, function(e, playlist){
                          db.profiles.findOne({_id: id}, function(e, self){
                          var imgurl;
			                    var profurl;
                          console.log(self.url);
                         if(profile.url && profile.changedPic == "none"){
				                      profurl = profile.url;	
			                   } else{
				                  profurl = myS3Account.readPolicy(pid, PIC_BUCKET, 60);
			                   } 
			                   if(self.url && self.changedPic == "none"){
                              imgurl = self.url;
                          }
                          else if(self.changedPic === "true" || self.changedPic === "none"){
                            imgurl = myS3Account.readPolicy(id, PIC_BUCKET, 60);
                          }
                          else{
                            imgurl = myS3Account.readPolicy(id, PIC_BUCKET, 60);
                          }
                         res.render('profileView', {profID: profurl, id:pid, name: profile.name, bio:profile.bio, location:profile.location, imgid: imgurl, songs:songs, playlist: playlist, songId: vid, facebook: profile.facebook, twitter: profile.twitter, createModal: "null", follow: follow});
                          })
                        })        
                }
            })
        }
    })    
}
})

app.post('/vidPlay', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    var temp = req.body.video;
    var vid = myS3Account.readPolicy(temp, S3_BUCKET, 60);
    console.log(vid);
    res.send({video: vid});
	}
})

app.post('/addPlay', function(req, res){
    var id;
    var name;
	
	
    if(req.session.user == undefined){
            id = req.user[0]._id;
    }
    else if(req.user == undefined){
            if(req.session.user[0] == undefined){
                id = req.session.user._id;
            } else {
                id = req.session.user[0]._id;
            }
    }
    db.music.findOne({_id: parseInt(req.body.sid)}, function(e, o){
		console.log(o);
		name = o.artistName;
		db.playlists.findOne({songID: req.body.sid, artistID:id}, function(e,o){
			  if (!o && !e){
				  db.playlists.insert({
					songID: req.body.sid,
					name: req.body.name,
					artistName: name,
					artistID: id
				}, function(e, o){
					if(e) res.send(e, 400);
				else{
				  res.send({name: req.body.name, id: req.body.sid});
				  Feed.share(id, {type: 'favorite', id: req.body.sid, name: req.body.name}, function(data){
					if (data == false)console.log("Share failed");
				  });
				}
				});
			}
		});
    });
})  

app.get('/profile', function(req, res){
    console.log(req.user);
    console.log(req.session.user);
    if(req.session.user == undefined && req.user == undefined){
            res.redirect('/');
    }
    else{
        var vid = 0;
        var id;
        if(req.session.user == undefined){
            id = req.user[0]._id;
        }
        else if(req.user == undefined){
            if(req.session.user[0] == undefined){
                id = req.session.user._id;
            }
            else{
                id = req.session.user[0]._id;
            }
        }
        db.profiles.findOne({_id: id}, function(e, profile){
            if(e){
                console.log(e);
            }
            else if(profile == undefined){
                res.redirect('/create');
            }
            else{
                db.music.find({artistID: id}, function(e, songs){
                    if(e){
                        console.log(e);
                    }
                    else{
                         db.playlists.find({artistID: id}, function(e, playlist){
                          var imgurl;
                          console.log(profile.url);
                          if(profile.url && profile.changedPic == "none"){
                              imgurl = profile.url;
                          }
                          else if(profile.changedPic === "true" || profile.changedPic === "none"){
                            imgurl = myS3Account.readPolicy(id, PIC_BUCKET, 60);
                          }
                          else{
                            imgurl = myS3Account.readPolicy(id, PIC_BUCKET, 60);
                          }
                         res.render('profile', {id: id, name: profile.name, bio:profile.bio, location:profile.location, imgid: imgurl, songs:songs, playlist: playlist, songId: vid, facebook: profile.facebook, twitter: profile.twitter, createModal: "null"});
                        })        
                    }
                });
            };
        });
    }
});


app.post('/pldata',function(req,res){
	 if(req.session.user == undefined && req.user == undefined){
            res.redirect('/');
    }
    else{
        var vid = 0;
        var id;
        if(req.session.user == undefined){
            id = req.user[0]._id;
        }
        else if(req.user == undefined){
            if(req.session.user[0] == undefined){
                id = req.session.user._id;
            }
            else{
                id = req.session.user[0]._id;
            }
        }
	
		var sid = req.body.sid;
	
		
		
		db.music.findOne({_id: parseInt(sid)}, function(e, m){
			if (!e && m ) res.send(m);
			else res.send(204);
		});
	
	}
});


app.post('/changeName', function(req, res){
  var id;
  		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else{
            id = req.session.user[0]._id;
        }
   }
   db.profiles.update({_id: id}, {$set: {name: req.body.editName}});
   }
})

app.post('/changeBio', function(req, res){
    var id;
			if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else{
            id = req.session.user[0]._id;
        }
   }
   db.profiles.update({_id: id}, {$set: {bio: req.body.editBio}});
   res.send({msg:'ok'});
   }
})

app.post('/changeLocation', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    var id;
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else{
            id = req.session.user[0]._id;
        }
   }
   db.profiles.update({_id: id}, {$set: {location: req.body.editLocation}});
   res.send({msg: 'ok'});
   }
})

app.post('/changeImage', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/');
		}
else{
    var stream = fs.createReadStream(req.files.file.path);
    var id;
    if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else{
            id = req.session.user[0]._id;
        }
    }
    db.profiles.update({_id: id}, {$set: {changedPic: "true"}});
    upload = new mpu(
        {
            client: picClient,
            objectName: id.toString(), // Amazon S3 object name
            stream: stream,
        },
        // Callback handler
        function(err, obj) {
             if(err){
               console.log(err);
               res.send(err, 400);
             }
            else{
                 console.log(obj); //for testing purposes print the object
                 res.redirect('/profile');
           }
          // If successful, will return a JSON object containing Location, Bucket, Key and ETag of the object
        }
    );
	}
})

app.post('/playDelete', function(req, res){
   if(req.session.user == undefined && req.user == undefined){
            res.redirect('/');
    }else{
   if(req.session.user == undefined){
        id = req.user[0]._id;
    }
    else if(req.user == undefined){
        if(req.session.user[0] == undefined){
            id = req.session.user._id;
        } else{
            id = req.session.user[0]._id;
        }
    }


    var sid = req.body.id;
    db.playlists.remove({$and : [{songID: sid}, {artistID: id}]}, true);
    res.send({msg: "Deleted", id: req.body.id});
	}
});

app.post('/deleteSong', function(req, res){
    if (req.session.user == null && req.user == null) {
      res.redirect('/');
	  }else{
    var sid = req.body.id;
    console.log(req.body.id);
    db.tournament.find({_id: sid}, function(e, o){
        console.log(o);
        if(e){
            console.log(e);
        }
        else if(o.length > 0){
            res.send({msg: "no"});
        }
        else if(o.length == 0){
            db.music.remove({_id: parseInt(sid)}, function(e, o){
				if (o) {
					Feed.share(id, {type: 'delete', id: sid, name: req.body.name}, function(data){
						if (data == false)console.log("Share failed");
					});
				}
			})
            db.playlists.remove({songID: sid}, function(e, o){});
            client.deleteFile(parseInt(sid), function(e, res){});
            res.send({msg: "yes", id: sid, name: req.body.name})
        }
    });
	}
})

app.post('/counter', function(req,res){
    if(req.session.user == undefined && req.user == undefined){
            res.redirect('/');
    }
	else{
	var id = req.body.id;
	db.ads.update({_id: id}, {$inc:{ clicks:1}});
	}
});

app.get('/init',function(req,res){
	db.users.remove();
	db.profiles.remove();

	db.locals.remove();
	db.tournament.update({genre:"Rap"}, {$set:{votes:0, views:0}},{multi:true});
	db.temps.remove();
	res.send("asd");
});
/*****************************************404**************************************************/
app.get("*", function(req, res){
      res.redirect('/profile');
})
/*****************************************404 done**************************************************/

http.createServer(app).listen(app.get('port'), function(){
    console.log("Server listening on port " + app.get('port'));
});
