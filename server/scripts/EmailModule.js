EmailModule = function(){};
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth:{
		user: "debug12@gmail.com",
		pass: "productteam"
	}
});

EmailModule.prototype.composeFeedback = function(o)
{
	var html = "<html><body>";
		html += "User "+o.name+" sent feedback: "
		html += o.feedback;
		html += "<br><br> In the "+o.category+ " category";
		html += "</body></html>";

	var mailOptions = {
		from: o.email,
		to: "kumarde@umich.edu",
		subject: "Feedback from "+o.name,
		text: "Stamp.fm Feedback",
		html: html
	}
	return mailOptions;
}

EmailModule.prototype.composeResponse = function(o)
{
	var html = "<html><body>";
		html += "Dear "+ o.name + ",<br>";
		html += "Thank you for your "+ o.category+" .<br><br>"
		html += "We appreciate all the support here at Stamp.fm!";
		html += "</body></html>";
}

EmailModule.prototype.composeEmail = function(o)
{
	var link = "localhost:8880/reset-password?e="+o.email+"&p="+o.pass;
	var a = "<a href = "+link+"> Click here to reset</a><br><br>";
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
		text: "Your Stamp.fm password reset.",
		html: html
	}
	return mailOptions;
}

EmailModule.prototype.dispatchFeedback = function(o, callback){
	smtpTransport.sendMail(o, function(e, res){
		if(e){
			console.log(e);
		} else {
			console.log("message sent");
		}
	});
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