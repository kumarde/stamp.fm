$(document).ready(function() {
	//users();
	$('#search').keyup(search);
});
	 function search() {
        var str = $('#search').val();
        if (str!=""){
            $.ajax({ 
                url: '/namesearch',
                type: 'POST',
                cache: false, 
                data: {search: str},
                success: function(data){
                if (typeof data.redirect == 'string' )window.location = data.redirect;
                else if (typeof data.error == 'string' )alert(data.error);
                else {
                    var $div;
                    $('#users').html("");
                    for ( var i = 0; i < data.length; i++ ){
                    	//$link = "localhost:8888/view?id="+data[i]._id;
                    	//console.log($link);
                    	//$a = $('<a href = "localhost:8888/view?id="'+link+'">'+data[i].name+'</a>');
                        $div = $('<div class="user" id="'+data[i]._id+'">'+data[i].name+'<img src="facebookIcon.png" id="followButton" style="float:right"></div>');
                        $div.click(follow);
                        $('#users').append($div);
                        }
                    }
                }
            });        
            }
            else $('#users').html("");
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
			else if (typeof data.error == 'string')alert(data.error);
			else alert(data);
			}
		});
	}

