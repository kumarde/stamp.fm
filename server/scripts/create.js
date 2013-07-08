$(document).ready(function() {
    $("#inputFields").submit(function(e){
      return false;
    });
    $('#createAccount').click(function(event){ 
     var name = $('#name').val();
     var email = $('#email').val();
     var password = $('#password').val();
     var emailconfirm = $('#emailconfirm').val();
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	 
	 name = name.replace(/\W\s/g,"");
	 var box;
	 if($("#box").is(':checked'))box = 1;
	 else box = 0;
     if(name == "" || email == "" || emailconfirm == "" || password == ""){
      $('div#unfilled').addClass("unhidden");
     }
    else if (!email.match(re)){
      $('div#bademail').addClass("unhidden");
    }
	else if(email != emailconfirm){
      $('div#nomatch').addClass("unhidden");
     }
	 else if (box == 0){
	  $('div#boxerror').addClass("unhidden");
	}
	 else{
     $.ajax({ 
           url: '/',
           type: 'POST',
           cache: false, 
           data: {name: name, email: email, password: password},
           success: function(data){
            if(data.error != null){
              //alert(data.error);
              $('div#error').addClass("unhidden");

            }
            if (typeof data.redirect == 'string'){
              window.location = data.redirect;
            }
          }
        })
       }
      });
});
