$(document).ready(function(){
	$.ajax({
		url: "/userl",
		type: "POST",
		cache: false,
		success: function(data){
			for (var i = 0; i < data.length; ++i){
				.ajax({
					url: "/profd",
					type: "POST",
					cache: false,
					data: {data[i]._id},
					success: function(data){
						
					}
				});
				
				.ajax({
					url: "/songsl",
					type: "POST",
					cache: false,
					data: {data[i]._id},
					success: function(data){
						for (var i = 0; i < data.length; ++i){
							.ajax({
								url: "/songsd",
								type: "POST",
								cache: false,
								data: {data[i]._id},
								success: function(data){
									
								}
							});
						}
					}
				});
			}
		}
	});
});