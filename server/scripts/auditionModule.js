AuditionModule = function(){};

var db = require('mongojs').connect("db", ["votes"]);

AuditionModule.prototype.UpdateDB = function(callback){
	db.votes.update({ $inc: {votes:1}}, { multi: true});
	console.log("Votes has been updated");
};

exports.AuditionModule = AuditionModule;