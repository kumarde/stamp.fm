var express = require('express')
  , engine = require('ejs-locals')
  , form  = require('express-form')
  , field = form.field;

var app = express();

app.configure(function(){
    app.use(express.static(__dirname + '/stylesheets'));
    app.use(express.static(__dirname + '/images'));
    app.use(express.static(__dirname + '/video-js'));
    app.use(express.static(__dirname + '/videos'));
    app.use(express.static(__dirname + '/scripts'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-duper-secret-secret'}));
    app.engine('ejs', engine);// use ejs-locals for all ejs templates
    app.set('views',__dirname + '/views');//set views directory
    app.set('view engine', 'ejs'); // so you can render('index')
    app.engine('html', require('ejs').renderFile);
    app.use(app.router);
});


var fs = require('fs');

var db = require('mongojs').connect("stampfm", ["music", "users", "counters"]);
var TestModule =  require('./scripts/testModule.js').TestModule;
var AuditionModule = require('./scripts/AuditionModule.js').AuditionModule;
var AccountModule = require('./scripts/AccountModule.js').AccountModule;
var EmailModule = require('./scripts/EmailModule.js').EmailModule;
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
});

var testModule = new TestModule;
var auditionModule = new AuditionModule;
var accountModule = new AccountModule;
var emailModule = new EmailModule;

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
    });
})

app.get('/upload', function(req, res){
    res.render('upload.html', {title: "hi"})
})

/*******************************LOGIN STUFF HERE******************************************/
app.get('/login', function(req, res){
	if(req.cookies.user == undefined || req.cookies.pass == undefined){
		res.render('login', {title: 'Hello - Please login To Your Account'});
	}else{
		accountModule.autoLogin(req.param('user'), req.param('pass'), function(o){
			if(o != null){
				req.session.user = o;
				res.redirect('/loggedin');
			} else{
				res.render('login', {title: "Hello - Please Login to your Account"});
			}
		});
	}
});

app.post('/login', function(req, res){
	accountModule.manualLogin(req.param('user'), req.param('pass'), function(e, o){
		if(!o){
			res.send(e, 400);
		} else{
			req.session.user = o;
			if(req.param('remember-me') == 'true'){
				res.cookie('user', o.user, {maxAge: 900000});
				res.cookie('pass', o.pass, {maxAge: 900000});
			}
          console.log("You are being redirected home");
          console.log(req.session.user);
			    res.redirect('/');
		}
	});
});

app.get('/signup', function(req, res){
	res.render('account.html', {title: "Signup"});
});

    app.post('/signup', 

        form(
            field("name").required(),
            field("email").required(),
            field("user").required(),
            field("pass").required(),
            field("pass-confirm").equals("pass")
        )
        ,function(req, res){
        if(!req.form.isValid){
            res.send(req.form.errors)
        }
        else{
            AM.addNewAccount({
                name    : req.param('name'),
                email   : req.param('email'),
                user    : req.param('user'),
                pass    : req.param('pass'),
                country : req.param('country')
            }, function(e){
                if (e){
                    res.send(e, 400);
                }   else{
                    res.send('ok', 200);
                }
            });
        }
    });


app.get('/forgot', function(req ,res, next){
    res.render('forgot', {title: 'Forgot Password?'});
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
