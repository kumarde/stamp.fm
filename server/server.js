var flash = require('connect-flash')
  , express = require('express')
  , engine = require('ejs-locals')
  , form  = require('express-form')
  , moment = require('moment')
  , http = require('http')
  , field = form.field
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , fs = require('fs')
  , db = require('mongojs').connect("stampfm", ["profiles", "music", "users", "tournament"]);

var s3 = require('s3policy');
var myS3Account = new s3('AKIAIZQEDQU7GWKOSZ3A', 'p99SnAR787SfJ2v+FX5gfuKO8KhBWOwZiQP8AdE5');
var mpu = require('knox-mpu');
var S3_KEY = 'AKIAIZQEDQU7GWKOSZ3A';
var S3_SECRET = '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';
var S3_BUCKET = 'media.stamp.fm';
var PIC_BUCKET = 'pictures.stamp.fm'
var knox = require('knox');
var songs = 0;

/***********************CHECK HOW MANY SONGS THERE ACTUALLY ARE*************************/
db.music.count(function(e, count){
    if(count){
        songs = count;
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
        callbackURL: "http://localhost:8888/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done){
            db.users.findOne({_id: profile.id}, function(err, user){
                if(user){
                        flag = true;
                        return done(null, user);
                }
                else if(err){
                    return done(err);
                }
                else{
                    db.users.insert({name:profile._json.name, _id:profile.id, email:profile._json.email, date:moment().format('MMMM Do YYYY, h:mm:ss a')});
                    return done(null, user);
                }
            });
        }
    ));
});

/*INSTANTIATE MODULES*/

var TestModule =  require('./scripts/testModule.js').TestModule;
var AuditionModule = require('./scripts/AuditionModule.js').AuditionModule;
var AccountModule = require('./scripts/AccountModule.js').AccountModule;
var EmailModule = require('./scripts/EmailModule.js').EmailModule;
var UploadModule = require('./scripts/UploadModule.js').UploadModule;
var UserModule = require('./scripts/UserModule.js').UserModule;
var FeedModule = require('./scripts/FeedModule.js').FeedModule;

/*****************algorithm*****************/

//if collection exists, store variable count == 0;
var counter = 0;
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
});

var testModule = new TestModule;
var auditionModule = new AuditionModule;
var accountModule = new AccountModule;
var emailModule = new EmailModule;
var uploadModule = new UploadModule;
var userModule = new UserModule;

var Feed = new FeedModule;

app.get('/feed', function(req, res){
		if (req.session.user == null && req.user == null) {
			res.redirect('/login');
		}
		else res.render('feed');
});

app.post('/feed/add', function(req, res){

	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/login'});
	}
	else{
		if(req.session.user == null){
			id = req.user[0]._id;
		}
		else if(req.user == null){
			id = req.session.user._id;
		}
		Feed.add(id, req.body.type, req.body.data, function(data) {
			res.send(data);
		});
	}
});

app.post('/feed/load', function(req, res){

	if (req.session.user == null && req.user == null) {
		res.send({redirect:'/login'});
	}
	else{
		if(req.session.user == null){
			id = req.user[0]._id;
		}
		else if(req.user == null){
			id = req.session.user._id;
		}

		Feed.load(req.body.index, function(data) {
			if ( data == null )res.send({error: "Up to date"});
			else res.send(data);
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
    });
})

/*********************************UPLOAD TO THE TOURNAMENT ROUTES ***************************************/

app.get('/upload', function(req, res){
    console.log(req.session.user);
    console.log(req.user);
    if(req.session.user == null && req.user == null){
        //tell the user they are not logged in, redirect to login
        res.redirect('/login');
    }
    else{
        res.render('upload');
    }
});

app.post('/upload', function(req, res){
    var id;
    if(req.session.user == null){
        id = req.user[0]._id;
    }
    else if(req.user == null){
        id = req.session.user._id;
    }
    var genre = req.body.genre.toString();
    var name = req.body.name;
    db.music.save({_id: songs, name: name, artistID:id});
    db.tournament.findOne({ $and: [{genre: genre}, {artistID: id}]}, function(e,o){
        if(o){
            res.send({msg:"You have already entered in one video in this genre."});
        } else {
            db.tournament.insert({genre: genre, artistID: id, _id: songs, name: name});
            res.send({msg: "ok"})
            res.send({redirect:'/upload'});
        }
    });
    ++songs;
})

app.post('/file-upload', function(req, res, next){
    var stream = fs.createReadStream(req.files.file.path);
    var id;
    upload = new mpu(
        {
            client: client,
            objectName: songs.toString(), // Amazon S3 object name
            stream: stream
        },
            // Callback handler
        function(err, obj) {
             if(err){
               console.log(err);
               res.send(err, 400);
             }
            else{
                 console.log(obj); //for testing purposes print the object
                 if(req.session.user == null){
                    id = req.user[0]._id;
                 }
                 else if(req.user == null){
                   id = req.session.user._id;
                 }
           }
                // If successful, will return a JSON object containing Location, Bucket, Key and ETag of the object
        }
    ); 
    res.send("back");
});

/************************************END UPLOAD TO THE TOURNAMENT****************************************/


/*******************************LOGIN STUFF HERE******************************************/

/*FACEBOOK AUTH*/
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/profile',
                                        failureRedirect: '/login'}));

app.get('/login', function(req, res){
	if(req.cookies.user == undefined || req.cookies.pass == undefined){
        if(req.session.user == null && req.user == null){
		  res.render('login', {title: 'Hello - Please login To Your Account', error: "hello"});
        }
        else{
            res.redirect('/upload');
        }
	}else{
		accountModule.autoLogin(req.param('user'), req.param('pass'), function(o){
			if(o != null){
				req.session.user = o;
				res.redirect('/upload');
			} else{
				res.render('login', {title: "Hello - Please Login to your Account", error:"hello"});
			}
		});
	}
});

app.post('/login', function(req, res){
	accountModule.manualLogin(req.body.email, req.body.password, function(e, o){
		if(!o){
            res.send({error: "Error: Username and Password Combination don't match"});
		} else{
			req.session.user = o;
            console.log(o);
			if(req.body.rememberme == 'true'){
                console.log("rememberme works!");
				res.cookie('email', o.email, {maxAge: 900000});
				res.cookie('pass', o.pass, {maxAge: 900000});
			}
          console.log("You are being redirected home");
          console.log(req.user);
			    res.send({redirect:'/profile'});
		}
	});
});

app.get('/signup', function(req, res){
	res.render('createAccount', {title: "Signup"});
});

app.post('/signup', function(req, res){
    accountModule.addNewAccount({
        name    : req.body.Name,
        email   : req.body.email,
        pass    : req.body.password,
    }, function(e, o){
        if (e){
            res.send({error: "Error: Username already exists"});
        }   else{
            req.session.user = o;
            res.send({redirect:'/create'});
       }
    });
});

app.get('/forgot', function(req ,res, next){
    res.render('forgot', {title: 'Forgot Password?'});
});

app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});


app.post('/forgot', function(req, res, next){
    accountModule.getAccountByEmail(req.param('email'), function(o){
        if(o){
            res.send('ok', 200);
            var options = emailModule.composeEmail(o);
            emailModule.dispatchResetPasswordLink(options, function(e, m){
                if(!e){
                    //do nothing
                } else{
                    res.send('email-server-error', 400);
                    for(k in e) console.log('error : ', k, e[k]);
                }
            });
        }   else{
            res.send('email-not-found', 400);
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


/********************************************LOGIN STUFF DONE*******************************/
/**************************************TIME TO DO PROFILES***********************************/
app.get('/create', function(req, res){
    if(req.session.user == null && req.user == null){
        res.redirect('/login');
    }
    else{
        var email;
        if(req.session.user == null){
            email = req.user[0].email;
        }
        else if(req.user == null){
            email = req.session.user[0].email;
        }
        console.log(email);
        db.users.find({email: email}, function(e, o){
            console.log(o);
            res.render('CreateProfile', {name: o[0].name});
        })
    } 
});

app.post('/create', function(req, res){
    console.log(req.files);
    var stream = fs.createReadStream(req.files.picture.path);
    var id;
    if(req.session.user == null){
        id = req.user[0]._id;
    }
    else if(req.user == null){
        id = req.session.user._id;
    }
    upload = new mpu(
        {
            client: picClient,
            objectName: id.toString(),
            stream: stream
        },
        function(e, o){
            if(e){
                console.log(e);
                res.send(e, 400);
            }
            else{
                console.log(o);
                userModule.updateDB(req.param('name'), req.param('location'), req.param('bio'), id);
                //need to actually add something to the profiles collection awkward.
                db.music.find({accountID: id}, function(e, songs){
                    res.redirect('/profile');   
                }); 
            }
        }
    );
});

app.get('/video/:fname', function( req, res) {
    res.render('video',{vidurl: myS3Account.readPolicy(req.params.fname, 'media.stamp.fm', 60)});
});   

app.get('/profile', function(req, res){
    if(req.session.user == null && req.user == null){
            res.redirect('/login');
    }
    else{
        if(req.query["id"]){
              vid = myS3Account.readPolicy(req.query["id"], 'media.stamp.fm', 60)
        } else {
            vid = 0;
        }
        var id;
        if(req.session.user == null){
            id = req.user[0]._id;
        }
        else if(req.user == null){
            id = req.session.user._id;
        }
        db.profiles.findOne({_id: id}, function(e, profile){
            if(e){
                console.log(e);
            }
            else if(!profile){
                res.redirect('/create');
            }
            else{
                db.music.find({artistID: id}, function(e, songs){
                    if(e){
                        console.log(e);
                    }
                    else{
                        res.render('profile', {name: profile.name, bio:profile.bio, location:profile.location, imgid: myS3Account.readPolicy(id, 'pictures.stamp.fm', 60), songs:songs, songId: vid, createModal: "null"});
                    }
                });
            };
        });
    }
});

app.post('/profileUpload', function(req, res){
    var name = req.body.name;
    db.music.save({_id: songs, name: name, artistID:id}, function(e, o){
        if(e){
            console.log(e);
        } else {
            res.send({msg: "saved", songs: o})
        }
    });
    console.log()
})

app.get('/vidUpdate', function(req, res){
    console.log(req.body);
    vid = myS3Account.readPolicy(req.query["id"], 'media.stamp.fm', 60)
    if(req.session.user == null && req.user == null){
            res.redirect('/login');
    }
    else{
        var id;
        if(req.session.user == null){
            id = req.user[0]._id;
        }
        else if(req.user == null){
            id = req.session.user._id;
        }
        db.profiles.findOne({_id: id}, function(e, profile){
            if(e){
                console.log(e);
            }
            else{
                db.music.find({artistID: id}, function(e, songs){
                    if(e){
                        console.log(e);
                    }
                    else{
                        res.render('profile', {name: profile.name, bio:profile.bio, location:profile.location, imgid: myS3Account.readPolicy(id, 'pictures.stamp.fm', 60), songs:songs, songId: vid, createModal: "null"});
                    }
                });
            };
        });
    }
});

app.get('/reVideo', function(req, res){
    vid = myS3Account.readPolicy(req.body.songID, 'media.stamp.fm', 60);
    res.send({songID: vid});
})

/*****************************************404**************************************************/
app.get("*", function(req, res){
      res.render('page404');
})
/*****************************************404 done**************************************************/

http.createServer(app).listen(app.get('port'), function(){
    console.log("Server listening on port " + app.get('port'));
});