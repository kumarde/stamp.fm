$(document).ready(function() {
	
	var feednum = 0;
    $("#feedform").submit(function(e){
      return false;
    });

	$
	
    $('#post').click(function(){  
     $.ajax({ 
           url: '/feed/add',
           type: 'POST',
           cache: false, 
           data: { type: "message", data: {text: $('#message').val(), url: "www.google.com"}},
           success: function(data){
            if (typeof data.redirect == 'string' )window.location = data.redirect;
			else alert(data.text);
           }
        });
     });
	 
	$('#refresh').click(function(){  
     $.ajax({ 
           url: '/feed/load',
           type: 'POST',
           cache: false, 
           data: { index: feednum },
           success: function(data){
            if (typeof data.redirect == 'string' )window.location = data.redirect;
			else if (typeof data.error == 'string' )alert(data.error);
			else {
				//$('#feed').html("");
				feednum = data.index;
				for ( var i = 0; i < data.data.length; i++ ){
					$('#feed').append('<div class="feeddiv" id="f'+i+'">'+data.data[i].data.text+'</div></br>');
				}
			}
           }
        });
     });
});