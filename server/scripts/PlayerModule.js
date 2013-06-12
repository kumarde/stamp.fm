PlayerModule = function(){};
var db = require('mongojs').connect("stampfm", ["music"]);

PlayerModule.prototype.forw = function(id){
	++id;
}

PlayerModule.prototype.back = function(id){
	--id;
}

PlayerModule.prototype.pause = function(readStream, res){
	readStream.on('data', function(err, data){
		var flushed = res.write(data);
		if(!flushed)
			readStream.pause();
	});
}

//idk what streams 

exports.PlayerModule = PlayerModule;