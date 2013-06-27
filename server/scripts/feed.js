var feednum = 0;

$(document).ready(function() {

    $("#feedform").submit(function(e){
      return false;
    });

    $('#post').click(function(){  
     $.ajax({ 
           url: '/addfeed',
           type: 'POST',
           cache: false, 
           data: { type: "message", data: {text: $('#message').val(), url: ""}},
           success: function(data){
            if (typeof data.redirect == 'string' )window.location = data.redirect;
			else console.log(data.text);
           }
        });
     });


	feed();
	followers();
	following();
	
	
});	
					
						


	function followers() {
	
		 $.ajax({ 
			   url: '/followers',
			   type: 'POST',
			   cache: false, 
			   success: function(data){
				if (typeof data.redirect == 'string' )window.location = data.redirect;
				else if (typeof data.error == 'string')alert(data.error);
				else {
					for ( var i = 0; i < data.length;i++ ){
						
						$.ajax({ 
							url: '/profile/data',
							type: 'POST',
							cache: false, 
							data: {id:data[i]},
							success: function(data){
								if (typeof data.redirect == 'string' )window.location = data.redirect;
								else if (typeof data.error == 'string')alert(data.error);
								else {
									$('#from').append('<div>'+data.name+'</div>');
								}
							}

						});
					}
				}
			}
		});
		
	}

	function following() {
		$.ajax({ 
			url: '/following',
           type: 'POST',
           cache: false, 
           success: function(data){
            if (typeof data.redirect == 'string' )window.location = data.redirect;
			else if (typeof data.error == 'string')alert(data.error);
			else {
				for ( var i = 0; i < data.length;i++ ){
					
					$.ajax({ 
						url: '/profile/data',
						type: 'POST',
						cache: false, 
						data: {id: data[i]},
						success: function(data){
							if (typeof data.redirect == 'string' )window.location = data.redirect;
							else if (typeof data.error == 'string')alert(data.error);
							else {	
								for ( var i = 0; i < data.shared.length; i++){
									$('#feed').append('<div> New song upload - '+data.shared[i].name+' by '+data.name+'</div>');
								}
								$('#to').append('<div>'+data.name+'</div>');
							}
						}

					});
				}
			}
			}
		});
		
	}
	
	function feed() {
	   /* $.ajaxSetup({
            cache: false,
			data: {id: feednum},
            beforeSend: function() {
               // $('#content').hide();
              //  $('#loading').show();
            },
            complete: function() {
               // $('#loading').hide();
               // $('#content').show();
            },
            success: function() {
                //$('#loading').hide();
                //$('#content').show();
				if (typeof data.redirect == 'string' )window.location = data.redirect;
				else if (typeof data.error == 'string' )alert(data.error);
				else {
				feednum = data.index;
				for ( var i = 0; i < data.data.length; i++ ){
					$('#feed').prepend('<div id="f'+i+'">'+data.data[i].data.text+'</div>');
				}
				}
			}
        });*/
			$.ajax({ 
				url: '/feed',
				type: 'POST',
				cache: false, 
				data: {index: feednum},
				success: function(data){
				if (typeof data.redirect == 'string' )window.location = data.redirect;
				else if (typeof data.error == 'string' )console.log(data.error);
				else {
					feednum = data.index;
					for ( var i = 0; i < data.data.length; i++ ){
						$('#feed').prepend('<div id="f'+i+'">'+data.data[i].data.text+'</div>');
					}
				}
				}

			});
		var refreshId = setInterval(function(){
			$.ajax({ 
				url: '/feed',
				type: 'POST',
				cache: false, 
				data: {index: feednum},
				success: function(data){
				if (typeof data.redirect == 'string' )window.location = data.redirect;
				else if (typeof data.error == 'string' )console.log(data.error);
				else {
					feednum = data.index;
					for ( var i = 0; i < data.data.length; i++ ){
						$('#feed').prepend('<div id="f'+i+'">'+data.data[i].data.text+'</div>');
					}
				}
				}

			});
		}, 10000);
      
	}

	

