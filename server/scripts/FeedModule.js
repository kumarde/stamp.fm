FeedModule = function(){};

var db = require('mongojs').connect("stampfm", ["feed"]);
var numfeeds;
db.feed.count(function(err, count){
	numfeeds = count;
});

FeedModule.prototype.add = function( id, type, data,callback) {
	db.feed.insert({_id: numfeeds++, owner: id, type: type, data: data},{continueOnError: true, safe: true}, function(err, doc){
		  console.log('err: ' + err);
       if(!err) callback(data);
	});
};

FeedModule.prototype.load = function( index, callback ) {
	if ( index < numfeeds ) {
		db.feed.find({ _id: { $gt: index-1 }}, function(err, docs) {
			console.log(docs.length);
			callback({index: numfeeds, data:docs});
		});
	}
	else callback(null);
};

exports.FeedModule = FeedModule;
