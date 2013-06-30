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
		db.profiles.findOne({_id:from}, function(err, f) {
			if (err || !f) callback(false);
			else {
				db.profiles.findOne({_id:to}, function(err, t) {
					if (err || !t) callback(false);
					else {
						if (f.following.indexOf(to) == -1){
						f.following.push( to);
						t.followers.push( from);
						db.profiles.update({_id:to},{$set:{followers: t.followers}});
						db.profiles.update({_id:from},{$set:{following: f.following}});
						callback({id:to,name:t.name});
						}else callback(false);
					}
				});
			}
		});
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
	db.profiles.findOne({_id:id}, function(err, p){
		if (err || !p)callback(false);
		else {
			data.date = new Date();
			p.shared.push(data);
			db.profiles.update({_id: id},{$set:{shared: p.shared}},function (err, o){
					if (err) callback(false);
					else callback(data);
			});
		}	
	});
};



exports.FeedModule = FeedModule;
