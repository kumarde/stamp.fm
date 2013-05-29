TestModule = function(){};
TestModule.prototype.message = "Message from the module";

var db = require('mongojs').connect("db", ["votes"]);



TestModule.prototype.ReadMessage = function(callback) {
	 callback(null, this.message);
};

TestModule.prototype.QueryDB = function(callback) {
	db.votes.find({ votes: 1 }, function(err, votes) {
		if( err || !votes) callback(true,null);
		else callback(null, votes);
	});
};

exports.TestModule = TestModule;