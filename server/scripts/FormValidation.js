function FieldISEmpty(id){
    var x=document.forms["InputFields"]["id"].value;
    if(x == null || x == ""){
      alert("The " + id " field must be filled out");
      return true;
    }
  }
function InvaildEmail(){
  var x=document.forms["InputFields"]["Email"].value;
  var atpos=x.indexOf("@");
  var dotpos=x.lastIndexOf(".");
  if( atpos<1 || dotpos<atpos+2 || dotpos+2>x.length){
    alert("Invalid e-mail address");
    return true;
  }
}
function PasswordConfirmNoMatch(){
  var x = document.forms["InputFields"]["Password"].value;
  var y = document.forms["InputFields"]["Password Confirmation"].value;
  if(x !== y){
    alert("Password Confirmation Doesn't Match Password");
    return true;
  }
}

  $(document).on('submit', 'InputFields', function(e){
    var form = e.currentTarget;
      if( FieldISEmpty("Email") || 
        FieldISEmpty("Password") || 
        FieldISEmpty("Password Confirmation") || 
        FieldISEmpty("Name")|| 
        FieldISEmpty("Username") ||
        InvaildEmail() ||
        PasswordConfirmNoMatch()){

      }
      else{
    $.ajax({
      url: sdfsdfsdf,
      type: 'POST',

      data: $(form).serialize(),
      success: function(){},
      error: function(){

      },
    });
    e.preventDefault();
  })};