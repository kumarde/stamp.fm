EmailModule = function(){};
var email = require('emailjs/email');
var server = email.server.connect({
	user 		: 	"debug12",
	password 	: 	"productteam",
	host 		: 	"smtp.gmail.com",
	ssl 		: 	true
});

EmailModule.prototype.dispatchResetPasswordLink = function(account, callback)
{
	server.send({
		from         : "Debug12 <debug12@gmail.com>",
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'I hope this works',
		attachement  : EmailModule.prototype.composeEmail(account)
	}, callback);
}

EmailModule.prototype.composeEmail = function(o)
{
	var link = 'localhost:8880/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/stamp.fm'>stamp.fm</a><br><br>";
		html += "</body></html>";
		console.log(html);
	return  [{data:html, alternative:true}];
}

exports.EmailModule = EmailModule;