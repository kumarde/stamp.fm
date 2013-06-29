var feednum = 0;

var feedarray = [];
var followingarray = [];

//fill these out to the correct id's to append things to
var feedid = "feed";
var followersid = "from";
var followingid = "to";

$(document).ready(function() {
	
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
									$('#'+followersid).append('<div>'+data.name+'</div>');
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
						success: function(prof){
							if (typeof data.redirect == 'string' )window.location = prof.redirect;
							else if (typeof prof.error == 'string')alert(prof.error);
							else {	
								followingarray.push(prof);
								$('#'+followingid).append('<div>'+prof.name+'</div>');
								for ( var j = 0; j < prof.shared.length; j++){
									var $feedentry = $('<div id="feedElement">'+prof.name+' Uploaded a New Song ('+prof.shared[j].name+')'+'</div>');
									prof.shared[j].element = $feedentry;
									prof.shared[j].date = new Date(prof.shared[j].date);
									feedarray.push(prof.shared[j]);
									//$('#'+feedid).prepend($feedentry);
								}
								if (followingarray.length == data.length){
									feedarray.sort(function(x,y){
										return y.date - x.date;
									});
									for (var k = feedarray.length-1; k >= 0; k--){
										$('#'+feedid).append(feedarray[k].element);
									}
								}
							}
						}

					});
				}
			}
			}
		});
		
	}
	
	/*function feed() {
	    $.ajaxSetup({
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
        });
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
     });*/

