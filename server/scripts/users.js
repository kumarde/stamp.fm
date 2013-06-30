$(document).ready(function() {
	$('#search').keyup(search);
	$('#searchform').submit(function(event){
		event.preventDefault();
		window.location = "/view?id="+$('#users').children('.user')[0].id;
	});
});
	 function search() {
		$('#users').html("");
        var str = $('#search').val();
        if (str!=""){
           /* $.ajax({ 
                url: '/namesearch',
                type: 'POST',
                cache: false, 
                data: {search: str},
                success: function(data){
                if (typeof data.redirect == 'string' )window.location = data.redirect;
                else if (typeof data.error == 'string' )alert(data.error);
                else {
                    var $div;
                    for ( var i = 0; i < data.length; i++ ){
                    	//$link = "localhost:8888/view?id="+data[i]._id;
                    	//console.log($link);
                    	//$a = $('<a href = "localhost:8888/view?id="'+link+'">'+data[i].name+'</a>');
                        $div = $('<div class="user" id="'+data[i]._id+'">'+data[i].name+'</div>');
						$img = $('<img src="facebookIcon.png" id="f'+data[i]._id+'" class="followButton" style="float:right">');
                        $img.click(follow);
						$div.click(function(){window.location = "/view?id="+data[i]._id});
						$div.append($img);
	
                        $('#users').append($div);
                        }
                    }
                }
            });*/
	    $.ajax({ 
                url: '/bandsearch',
                type: 'POST',
                cache: false, 
                data: {search: str},
                success: function(data){
                if (typeof data.redirect == 'string' )window.location = data.redirect;
                else if (typeof data.error == 'string' )alert(data.error);
                else {
                    var $div;
                    for ( var i = 0; i < data.length; i++ ){
                    	//$link = "localhost:8888/view?id="+data[i]._id;
                    	//console.log($link);
                    	//$a = $('<a href = "localhost:8888/view?id="'+link+'">'+data[i].name+'</a>');
                        $div = $('<div class="user" id="'+data[i]._id+'">'+data[i].name+'</div>');
						$img = $('<img src="facebookIcon.png" id="'+data[i]._id+'" class="followButton" style="float:right">');
                        $img.click(follow);
						$div.click(function(event){
							if (!$(event.target).hasClass("user")) return;
							window.location = "/view?id="+event.target.id;
						});
						$div.append($img);
                        $('#users').append($div);
                        }
                    }
                }
            });        
            }
    }


	function users() {
		$.ajax({ 
			url: '/users',
			type: 'POST',
			cache: false, 
			success: function(data){
			if (typeof data.redirect == 'string' )window.location = data.redirect;
			else if (typeof data.error == 'string' )alert(data.error);
			else {
				var $div;
				for ( var i = 0; i < data.length; i++ ){
					$div = $('<div class="user" id="'+data[i]._id+'">'+data[i].name+'</div>');
					$div.click(follow);
					$('#users').prepend($div);
					}
				}
			}
		});	
	}

	function follow(event) {
		$.ajax({ 
			url: '/follow',
			type: 'POST',
			cache: false, 
			data: { id: event.target.id},
			success: function(data){
			if (typeof data.redirect == 'string' )window.location = data.redirect;
			else if (typeof data.error == 'string')console.log(data.error);
			else console.log(data);
			}
		});
	}

