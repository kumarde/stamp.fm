$(document).ready(function(){
	var users = {};
	$.ajax({
		url: "/userl",
		type: "POST",
		cache: false,
		success: function(data){
			for (var i = 0; i < data.length; ++i){
				users[data[i]._id] = data[i];
				$('#main').append('<div>'+data[i].name+'<div>');
				/*$.ajax({
					url: "/profd",
					type: "POST",
					cache: false,
					data: {id:data[i]._id},
					success: function(data){
						users[data._id].profname = data.name;
					}
				});
				
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