AccountModule = function(){};

var crypto 	= require('crypto');
var db = require('mongojs').connect("stampfm", ["users"])
var moment 	= require('moment');

/* login validation methods */

AccountModule.prototype.autoLogin = function(user, pass, callback)
{
	db.users.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

AccountModule.prototype.manualLogin = function(email, pass, callback)
{
	db.users.findOne({email:email}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}
/* record insertion, update & deletion methods */

AccountModule.prototype.addNewAccount = function(newData, callback)
{
	db.users.findOne({email:newData.email}, function(e, o) {
		if (o){
			callback('email-taken');
		}	else{
			saltAndHash(newData.pass, function(hash){
				newData.pass = hash;
				// append date stamp when record was created //
				newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
				db.users.insert(newData, {safe: true}, callback);
			});
		}
	});
}

AccountModule.prototype.updateAccount = function(newData, callback)
{
	db.users.findOne({email:newData.email}, function(e, o){
		o.email 	= newData.email;
		if (newData.pass == ''){
			db.users.save(o, {safe: true}, callback);
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				db.users.save(o, {safe: true}, callback);
			});
		}
	});
}


AccountModule.prototype.updatePassword = function(email, newPass, callback)
{
	db.users.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		       	db.users.save(o, {safe: true}, callback);
			});
		}
	});
}
/* account lookup methods */

AccountModule.prototype.deleteAccount = function(id, callback)
{
	db.users.remove({_id: getObjectId(id)}, callback);
}

AccountModule.prototype.getAccountByEmail = function(email, callback)
{
	db.users.findOne({email:email}, function(e, o){ callback(o); });
}

AccountModule.prototype.validateResetLink = function(email, passHash, callback)
{
	db.users.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

AccountModule.prototype.getAllRecords = function(callback)
{
	db.users.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AccountModule.prototype.delAllRecords = function(callback)
{
	db.users.remove({}, callback); // reset	db collection for testing //
}

exports.AccountModule = AccountModule;

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = 'alkdaadfa!@&$@^$*68247612871abcdefghijklmnopqrstuvwxyz36'
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return	db.users.db.users.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	db.users.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	db.users.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
