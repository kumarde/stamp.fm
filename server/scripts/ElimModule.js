EliminationModule = function(){};

var db = require('mongojs').connect("test", ["tournament", "locals"]);

EliminationModule.prototype.initElim = function(genre, callback){
	db.locals.findOne({_id: genre}, function(e, o){
		if(e) console.log(e);
		else if(o){
			callback(o.array, o.c);
		}
		else{
			db.tournament.find({genre: genre}).sort({votes: -1}, function(e, results){
				db.locals.save({_id: genre, c: o.c, array: o.array});
				callback(results, 0);
			});
		}
	});
}

EliminationModule.prototype.updateDB = function(genre, c, array, total, callback){
  db.tournament.update({_id: array[c]._id}, {$inc:{views: 1}}); //on view, update view
  db.tournament.update({_id: array[c+1]._id}, {$inc: {views:1}}); //on view, update view
  //increment cPop so next time someone goes to testView, they see two new people
  //insert into locals collection datastore to keeptrack of Pop
  if(c >= total){
    db.tournament.find({genre: genre}).sort({votes: -1}, function(e, o){
      db.locals.update({_id: genre}, {$set: {array: o, c: 0}}); //set into locals
      callback(0, o.array);
    });
  }
  else if(c+1 == total){
    db.tournament.update({_id: array[c]._id}, {$inc: {views:1, votes:1}});
    db.tournament.find({genre: genre}).sort({votes: -1}, function(e, o){
      db.locals.update({_id: genre}, {$set: {array: o, c: 0}}); //set into locals
      callback(0, o);
  	});
  }
  else{
  	callback(1);
  }
}

exports.EliminationModule = EliminationModule; 