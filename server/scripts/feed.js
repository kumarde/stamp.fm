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
			   data: {id: "self"},
			   success: function(data){
				if (typeof data.redirect == 'string' )window.location = data.redirect;
				else if (typeof data.error == 'string')alert(data.error);
				else {
					$('#followers').append(data.length);
					for (var i = 0; i < data.length;i++){
						
						$.ajax({ 
							url: '/profile/data',
							type: 'POST',
							cache: false, 
							data: {id:data[i]},
							success: function(data){
								if (typeof data.redirect == 'string' )window.location = data.redirect;
								else if (typeof data.error == 'string')alert(data.error);
								else {
									var $div = $('<div id = "'+data._id+'">'+data.name+'</div>');
									$div.click(redirect);
									$div.css('cursor', 'pointer');
								 	$('#'+followersid).append($div);
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
		   data: {id: "self"},
           success: function(data){
            if (typeof data.redirect == 'string' )window.location = data.redirect;
			else if (typeof data.error == 'string')alert(data.error);
			else {
				$('#following').append(data.length);
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
								var $div = $('<div id = "'+prof._id+'">'+prof.name+'</div>');
								$div.click(redirect);
								 $('#'+followingid).append($div);
								for ( var j = 0; j < prof.shared.length; j++){
									if (prof.shared[j].type == 'upload')var $feedentry = $('<div data-tag ="'+prof._id+'" id="feedElement"><strong>'+prof.name+'</strong> uploaded a new video - '+prof.shared[j].name+''+'</div>');
									if (prof.shared[j].type == 'follow')var $feedentry = $('<div data-tag ="'+prof._id+'" id="feedElement"><strong>'+prof.name+'</strong> followed '+prof.shared[j].name+'</div>');
									if (prof.shared[j].type == 'favorite')var $feedentry = $('<div data-tag ="'+prof._id+'" id="feedElement"><strong>'+prof.name+'</strong> added a new favorite - '+prof.shared[j].name+'</div>');
									if (prof.shared[j].type == 'tournament')var $feedentry = $('<div data-tag ="'+prof._id+'" id="feedElement"><strong>'+prof.name+'</strong> entered the Tournament - '+prof.shared[j].name+''+'</div>');
									if (prof.shared[j].type == 'delete')var $feedentry = $('<div data-tag ="'+prof._id+'" id="feedElement"><strong>'+prof.name+'</strong> deleted a video - '+prof.shared[j].name+''+'</div>');
									$feedentry.click(redirect1);
									prof.shared[j].element = $feedentry;
									prof.shared[j].date = new Date(prof.shared[j].date);
									feedarray.push(prof.shared[j]);
									//$('#'+feedid).prepend($feedentry);
								}
								if (followingarray.length == data.length){
									feedarray.sort(function(x,y){
										return x.date - y.date;
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
	function redirect(event){
		window.location = "/view?id="+event.target.id; 
	}
	function redirect1(event){
		window.location = "/view?id="+$(this).attr("data-tag");
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

