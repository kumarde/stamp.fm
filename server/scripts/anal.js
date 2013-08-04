$(document).ready(function(){
	var users = {};
	var emails = {};
	$('#emails').click(function(){
		$('#main').html("");
		$.ajax({
			url: "/userl",
			type: "POST",
			cache: false,
			success: function(data){
				for (var i = 0; i < data.length; ++i){
					var $div = $('<div>'+data[i].email+'</div>');
					$('#main').append($div);
				}
			}
		});
	});
	$('#tourne').click(function(){
		$('#main').html("");
		$.ajax({
			url: "/tournd",
			type: "POST",
			cache: false,
			success: function(data){
				for (var i = 0; i < data.length; ++i){
					$('#main').append(emails[data[i].artistID]);
				}
			}
		});
	});
	$.ajax({
		url: "/userl",
		type: "POST",
		cache: false,
		success: function(data){
			for (var i = 0; i < data.length; ++i){
				var $div = $('<div></div>');
				var $namediv = $('<div>Username: '+data[i].name+'</div>');
				var $emaildiv = $('<div>Email: '+data[i].email+'</div><br><br>');
				var $emaildiv2 = $('<div>'+data[i].email+'</div>');
				$div.append($namediv);
				$div.append($emaildiv);
				$('#main').append($div);
				users[data[i]._id] = $div;
				emails[data[i]._id] = $emaildiv2;
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