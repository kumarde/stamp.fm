$(document).ready(function(){
	$('#inputFields').submit(function(){ 
     $.ajax({ 
           url: '/login',
           type: 'POST',
           cache: false,
           data: ,
           success: function(data){
              alert("does this happen?");
           		if(data.error == true){
           			alert("Password does not match Email");
           		}
           }
        })
     });
});