AuditionModule = function(){};

var db = require('mongojs').connect("db", ["votes"]);

AuditionModule.prototype.UpdateDB = function(callback){
	db.votes.update({ $inc: {votes:1}}, { multi: true});
	console.log("Votes has been updated");
	console.log(db.votes.find({votes:1}));

};

exports.AuditionModule = AuditionModule;