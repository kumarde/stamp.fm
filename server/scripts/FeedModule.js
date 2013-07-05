FeedModule = function(){};

var db = require('mongojs').connect("stampfm", ["feed","profiles"]);


var numfeeds;
db.feed.count(function(err, count){
	numfeeds = count;
});

FeedModule.prototype.add = function( id, type, data,callback) {
	db.feed.insert({_id: numfeeds++, owner: id, type: type, data: data},{continueOnError: true, safe: true}, function(err, doc){
       if(err || !doc ) callback(false); 
	   else callback(data);
	});
};

FeedModule.prototype.load = function( index, callback ) {
	if ( index < numfeeds ) {
		db.feed.find({ _id: { $gt: index-1 }}, function(err, docs) {
			if (err || !docs)callback(false);
			callback({index: numfeeds, data:docs});
		});
	}
	else callback(false);
};

FeedModule.prototype.follow = function(from, to, callback) {
	if (from == to)callback(false);
	else{
	
		db.profiles.update({_id: from}, { $addToSet: { following: to } } );
		
		db.profiles.update({_id: to}, { $addToSet: { followers: from } } );
		
		callback(true);
	}
};

FeedModule.prototype.unfollow = function(from, to, callback){
	if(from == to)callback(false);
	else{
		db.profiles.update({_id: from}, {$pull: {following: to}});
		db.profiles.update({_id: to}, {$pull: {followers: from}});
		callback(true);
	}
};


FeedModule.prototype.followers = function(id, callback) {
	db.profiles.findOne({_id:id}, function(err, p) {
		if (err || !p )callback(false);
		else {
			callback(p.followers);
		}
		
	});
};

FeedModule.prototype.following = function(id, callback) {
	db.profiles.findOne({_id:id}, function(err, p) {
		if (err || !p )callback(false);
		else callback(p.following);
	});
};

FeedModule.prototype.lookup = function(id, callback) {
	db.profiles.findOne({_id: id}, function(err, p) {
		if (err || !p)callback(false);
		else callback(p);
	});
};

FeedModule.prototype.share = function(id, data, callback){
	data.date = new Date();
	db.profiles.update({_id:id}, { $push: { shared : data} } );
	callback(data);
};



exports.FeedModule = FeedModule;
