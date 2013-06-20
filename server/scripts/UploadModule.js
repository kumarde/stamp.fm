UploadModule = function(){};

var db = require('mongojs').connect("stampfm", ["country", "pop", "alternative", "rap", "rnb", "instrumental", "hardrock", "EDM", "international", "folk"]);
var moment = require('moment');

UploadModule.prototype.uploadDB = function(genre, name, id, artistID)
{
	db.genre.findOne({artistID: artistID}, function(e, o)){
		if(!o){
			console.log('You have already uploaded a video for this tournament');
		}
		else{
			db.genre.save({_id: id, artistID: artistID, name: name, date: moment().format('MMMM Do YYYY, h:mm:ss a')});
		}
	}
}

exports.UploadModule = UploadModule;