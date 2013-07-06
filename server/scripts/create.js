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
	 
     if(name == "" || email == "" || emailconfirm == "" || password == ""){
      $('div#unfilled').addClass("unhidden");
        $('a#close').click(function(){
          $('div#unfilled').removeClass("unhidden");
      });
     }
    else if (!email.match(re)){
      $('div#bademail').addClass("unhidden");
        $('a#close').click(function(){
        $('div#bademail').removeClass("unhidden");
      });
    }
	else if(email != emailconfirm){
      $('div#nomatch').addClass("unhidden");
        $('a#close').click(function(){
        $('div#nomatch').removeClass("unhidden");
      });
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
              $('a#close').click(function(){
                  $('div#error').removeClass("unhidden");
              });
            }
            if (typeof data.redirect == 'string'){
              window.location = data.redirect;
            }
          }
        })
       }
      });
});