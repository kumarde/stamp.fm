TestModule = function(){};
TestModule.prototype.message = "Message from the module";

var db = require('mongojs').connect("db", ["users","reports"]);



TestModule.prototype.ReadMessage = function(callback) {
	 callback(null, this.message);
};

TestModule.prototype.QueryDB = function(callback) {
	db.users.find({ sex: "female"}, function(err, users) {
		if( err || !users) callback(true,null);
		else callback(null, users);
	});
};

exports.TestModule = TestModule;