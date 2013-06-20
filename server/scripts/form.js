$(document).ready(function(){
	$('#inputFields').submit(function(){  
     $.ajax({ 
           url: '/login',
           type: 'POST',
           cache: false,
           success: function(data){
           		if(data.error == true){
           			alert("Password does not match Email");
           		}
           }
        })
     });
});