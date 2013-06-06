AuditionModule = function(){};

var sorted;
var db = require('mongojs').connect("stampfm", ["music"]);

db.music.find().sort({_id:1}, function(err, rest){
  sorted = rest;
});

AuditionModule.prototype.UpdateDB = function(c, callback){
	db.music.update({_id:sorted[c]._id}, {$inc:{views:1}}, function(err, count){

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
          callback(0, sorted);
        })
    }
    else if(c+1 == counter){
      db.music.update({_id:sorted[c]._id}, {$inc:{views:1}, $inc:{votes:1}}, function(err,count){
        db.music.find().sort({votes:-1}, function(err, rest){
        sorted = rest;
        console.log(sorted);
        c = 0;
        callback(0, sorted);
        })
      })
    }
    else{
    	callback(1);
    }
};

exports.AuditionModule = AuditionModule;
