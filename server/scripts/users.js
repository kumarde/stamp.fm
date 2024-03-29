var users = {};
$(document).ready(function() {
	$('#search').keyup(searcher);
	$('#searchform').submit(function(event){
		event.preventDefault();
		window.location = "/view?id="+$('#users').children('.user')[0].id;
	});
	
	var shouldBlur = true;

    $("#search").blur(function() {
        setTimeout(function() {
            if (shouldBlur) {
                $('#users').html("");
                $("#search").val("");
				delete users;
				var users = {};
            }
        }, 200);
    });
    $(document).click(function(e) {
        if ($(e.target).is("#users")) {
            shouldBlur = false;
        }
        else {
            shouldBlur = true;
            if (!$(e.target).is("#search")) {
                $('#users').html("");
                $("#search").val("");
				delete users;
				var users = {};
            }
        }
    });
});
	 function searcher() {
		$('#users').html("");
		delete users;
		var users = {};
        var str = $('#search').val();
		
		str  = str.toLowerCase();
        if (str!="" && str.match(/\W/g) == null){
	    $.ajax({ 
                url: '/bandsearch',
                type: 'POST',
                cache: false, 
                data: {search: str},
                success: function(data){
                if (typeof data.redirect == 'string' )window.location = data.redirect;
                else if (typeof data.error == 'string' )console.log(data.error);
                else {
                    var $div;
                    for ( var i = 0; i < data.data.length; i++ ){
						if ( !users[data.data[i]] ){
							if ( data.data[i]._id != data.id ){
								$div = $('<div class="user" id="'+data.data[i]._id+'">'+data.data[i].name+'</div>');
								if (data.data[i].followers.indexOf(data.id) == -1 ){
									$img = $('<input type="button" value="Follow" onclick="buttonChange();" id="'+data.data[i]._id+'" class="followButton" style="float:right">');
									$img.click(follow);
								}
								else{
								$img = $('<input type="button" value="Forget" onclick="buttonChange();" id="'+data.data[i]._id+'" class="followButton" style="float:right">');
									$img.click(unfollow);
								}

								$div.click(function(event){
									if (!$(event.target).hasClass("user")) return;
									window.location = "/view?id="+event.target.id;
								});
								$div.append($img);
								$('#users').append($div);
							}
						}
                    }
                    }
                }
            });     
            }  
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

	function unfollow(event) {
		$.ajax({ 
			url: '/unfollow',
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

