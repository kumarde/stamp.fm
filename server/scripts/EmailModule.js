EmailModule = function(){};
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth:{
		user: "contactstampfm@gmail.com",
		pass: "thestampfmteam"
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
		to: "contactstampfm@gmail.com",
		cc: o.email,
		subject: o.category,
		text: "Stamp.fm Feedback",
		html: html
	}
	return mailOptions;
}
EmailModule.prototype.tempAccount = function(o){
	var link = "http://www.stamp.fm/tempaccount?e="+o.email+"&p="+o.pass;
	var a = "<a href = "+link+"> Click here to activate</a><br><br>";
	var html = "<html><body>";
	html += "Congratulations! You now have access to judge the Stamp.fm contestants.<br><br>";
	html += "Copy and paste this link to your broswer to start voting.<br><br>"
	html += link;
	html += "<br>"
	html += "For all inclusive access, register for FREE at stamp.fm, to";
	html += "<ul>";
	html += "<li>Judging (the only feature you have access to now)</li>";
	html += "<li> Creating a profile </li>";
	html += "<li> Adding songs to your favorites </li>";
	html += "<li> Downloading songs (soon to be implemented </li>";
	html += "<li> [Artists] Uploading songs to your profile </li>";
	html += "<li> [Artists] Competing in the tournament </li>";
	html += "<li> [Artists] Promoting your music </li></ul><br><br>";
	html += "<br><br>";
	html += "Cheers,<br>";
	html += "<a href='http://twitter.com/stamp.fm'>stamp.fm</a><br><br>";
	html += "</body></html>";
	var mailOptions = {
		from:"Stamp.fm <debug12@gmail.com>",
		to: o.email,
		subject: "Stamp.fm Temporary Access",
		text: "Activate your temporary access.",
		html: html
	}
	return mailOptions;
}


EmailModule.prototype.composeResponse = function(o)
{
	var html = "<html><body>";
		html += "Hi "+ o.name + ",<br><br>";
		html += "Thank you for your feedback! We pride ourselves on getting back to you ";
		html += "within 24 hours via email or phone. <br><br>We are constantly improving our service";
		html += " and it is because of people like you. <br><br>";
		html += "Thanks again,<br><br>";
		html += "Omar M. Hashwi<br>";
		html += "omar@stamp.fm<br>";
		html += "President & CEO";

	var mailOptions = {
		from: "Stamp.fm <omar@stamp.fm>",
		to: o.email,
		subject: "Feedback Helps Us Grow",
		text: "Feedback is very well appreciated.",
		html: html
	}
	return mailOptions;
}

EmailModule.prototype.composeEmail = function(o)
{
	var link = "stamp.fm/reset-password?e="+o.email+"&p="+o.pass;
	var a = "<a href = "+link+"> Click here to reset</a><br><br>";
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.email+"</b><br><br>";
		html += "Copy and Paste this link into your browser to reset Password<br><br>";
		html += link;
		html += "<br><br>";
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

EmailModule.prototype.dispatchResponse = function(o, callback){
	smtpTransport.sendMail(o, function(e, res){
		if(e) console.log(e);
		else console.log("message sent!");
	})
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