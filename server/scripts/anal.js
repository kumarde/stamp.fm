$(document).ready(function(){
	var users = {};
	$.ajax({
		url: "/userl",
		type: "POST",
		cache: false,
		success: function(data){
			for (var i = 0; i < data.length; ++i){
				var $div = $('<div></div>');
				var $namediv = $('<div>Username: '+data[i].name+'</div>');
				var $emaildiv = $('<div>Email: '+data[i].email+'</div><br><br>');
				$div.append($namediv);
				$div.append($emaildiv);
				$('body').append($div);
				users[data[i]._id] = $div;
				$.ajax({
					url: "/profd",
					type: "POST",
					cache: false,
					data: {id:data[i]._id},
					success: function(data){
						users[data._id].prepend('<div>Profilename: '+data.name+'</div>');
					}
				});
				/*
				$.ajax({
					url: "/songl",
					type: "POST",
					cache: false,
					data: {id:data[i]._id},
					success: function(data){
						if (data)users[data[0].artistID].songs = data;
						for (var i = 0; i < data.length; ++i){
							$.ajax({
								url: "/songsd",
								type: "POST",
								cache: false,
								data: {id: data[i]._id},
								success: function(data){
									
								}
							});
						}
					}
				});*/
			}
		}
	});
});