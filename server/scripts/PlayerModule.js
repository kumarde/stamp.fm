PlayerModule = function(){};
var db = require('mongojs').connect("stampfm", ["music"]);

PlayerModule.prototype.forw = function(id){
	++id;
}

PlayerModule.prototype.back = function(id){
	--id;
}

PlayerModule.prototype.pause = function(readStream, res){
	readStream.on('data', function(data){
		var flushed = res.write(data);
		if(!flushed)
			readStream.pause();
	});
}

PlayerModule.prototype.stop = function(readStream){
	readStream.end();
}

exports.PlayerModule = PlayerModule;