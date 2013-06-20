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
    alert("jgfzfdbfds");
    var a = email.val();
    var regexp = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_­-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9­]+.[a-z]{2,4}$/;
    if(regexp.text(a)){
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
    alert("Working");
    InvaildEmail();
    alert("khgfkhgf");
    InvaildPassword();
    InvalidPassConfirm();
    PasswordConfirmNoMatch();
    });

});
