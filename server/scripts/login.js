  $(document).ready(function() {
  
    $("#loginform").submit(function(e){

	  return false;
    });
    $('#loginLink').click(function(event){ 
     var email = $('input#emaili').val();
     var password = $('input#passi').val();
     var rememberme = $('input#rememberme').is(':checked');
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if(email == "" || password == ""){
      $('div#unfilled').addClass("unhidden");
     }
      else if (!email.match(re)){
        $('div#bademail').addClass("unhidden");
      }
      else{
     $.ajax({ 
           url: '/login',
           type: 'POST',
           cache: false, 
           data: {email: email, password: password, rememberme: rememberme},
           success: function(data){
            if(data.error != null){
              $('div#logerror').addClass("unhidden");
            }
            if (typeof data.redirect == 'string'){
              window.location = data.redirect;
            }
           }
        })
      }
     });
    $('#forgotpass').submit(function(e){
      return false;
    });
    $('#recoverPass').click(function(event){
      var email = $('input.enterEmail').val();
      $.ajax({
        url: '/forgot',
        type: 'POST',
        cache: false,
        data: {email: email},
        success: function(data){
          if(data.msg != "ok"){
            $('div#recovererror').addClass("unhidden");
          } else {
            $('div#recovereuccess').addClass("unhidden");
          }
        }
      })
    })
  });