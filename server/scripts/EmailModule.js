EmailModule = function(){};
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth:{
		user: "debug12@gmail.com",
		pass: "productteam"
	}
});

EmailModule.prototype.composeEmail = function(o)
{
	var link = "localhost:8880/reset-password?e="+o.email+"&p="+o.pass;
	var a = "<a href = "+link+"> Click here to reset</a><br><br>";
	console.log(a);
	console.log(o.email);
	console.log(o.pass);
	console.log(link);
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.email+"</b><br><br>";
		html += "Copy and Paste this link into your browser to reset Password<br><br>";
		html += link;
		html += "<br><br>"
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/stamp.fm'>stamp.fm</a><br><br>";
		html += "</body></html>";
	var mailOptions = {
		from:"Stamp.fm <debug12@gmail.com>",
		to: o.email,
		subject: "Password Reset",
		text: "Hello World!",
		html: html
	}
	return mailOptions;
}

EmailModule.prototype.dispatchResetPasswordLink = function(o, callback){
	smtpTransport.sendMail(o, function(e, res){
		if(e){
			console.log(e);
		} else{
			console.log("message sent: " + res.message);
		}
	});
}



exports.EmailModule = EmailModule;