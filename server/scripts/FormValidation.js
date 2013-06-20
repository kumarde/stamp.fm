$(document).ready(function(){
  var form = $("#InputFields");
  var name = $("#Name");
  var email = $("#Email");
  var password = $("#Password");
  var passconfirm = $("#PasswordConfirmation");
  
  function InvalidName(){
    if(name.val().length < 1){
      alert("Please enter a Valid Name");
    }
  }
  function InvalidEmail(){
    var a = email.val();
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if(!pattern.test(a)){
      alert("Please Enter a Valid Email");
    }
  }
  function InvalidPassword(){
    if(password.val().length < 1){
      alert("Please Enter a Valid Password");
    }
  }
  function InvalidPassConfirm(){
    if(passconfirm.val().length < 1){
      alert("Please Enter a Valid Password Confirmation");
    }
  }
  function PasswordConfirmNoMatch(){
    if(password.val() !== passconfirm.val()){
      alert("Passwords don't match");
    }
  }
  form.submit(function(e){
    e.preventDefault();
    InvalidName();
    InvalidPassword();
    InvalidPassConfirm();
    InvalidEmail();
    PasswordConfirmNoMatch();
    });
});
