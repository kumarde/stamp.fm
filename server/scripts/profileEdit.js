//text to input and back
  function exchange(el){
  var ie=document.all&&!document.getElementById? document.all : 0;
  var toObjId=/Edit$/.test(el.id)? el.id.replace(/Edit$/,'') : el.id+'Edit';
  var toObj=ie? ie[toObjId] : document.getElementById(toObjId);
  if(/Edit$/.test(el.id))
  toObj.innerHTML=el.value;
  else{
  toObj.style.width=el.offsetWidth+7+'px';
  toObj.value=el.innerHTML;
  }
  el.style.display='none';
  toObj.style.display='inline';
  }
//end text to input and back

//NAME invisible to visible
    function visibilityName()
    {
      if ( document.getElementById('submitNameButton').style.visibility == 'hidden' ) {
            document.getElementById('submitNameButton').style.visibility= 'visible';
          } else {
            document.getElementById('submitNameButton').style.visibility = 'hidden';
          }   
    }
//END NAME invisible to visible

//BIO invisible to visible
    function visibilityBio()
    {
      if ( document.getElementById('submitBioButton').style.display == 'none' ) {
            document.getElementById('submitBioButton').style.display= "";
          } else {
            document.getElementById('submitBioButton').style.display = "none";
          }   
    }
//END BIO invisible to visible

//LOCATION invisible to visible
    function visibilityLocation()
    {
      if ( document.getElementById('submitLocationButton').style.visibility == 'hidden' ) {
            document.getElementById('submitLocationButton').style.visibility= 'visible';
          } else {
            document.getElementById('submitLocationButton').style.visibility = 'hidden';
          }   
    }
//END LOCATION invisible to visible


//PICTURE invisible to visible
    function visibilityPicButton()
    {
      if ( document.getElementById('submitProfPic').style.visibility == 'hidden' ) {
            document.getElementById('submitProfPic').style.visibility= 'visible';
          } else {
            document.getElementById('submitProfPic').style.visibility = 'hidden';
          }   
    }
//END PICTURE invisible to visible

    function openDropdown()
    {
      if ( document.getElementById('dropdownContent').style.visibility == 'hidden' ) {
            document.getElementById('dropdownContent').style.visibility= 'visible';
            document.getElementById('playlist').style.zIndex = -99;
          } else {
            document.getElementById('dropdownContent').style.visibility = 'hidden';
            document.getElementById('playlist').style.zIndex = 99;
          }   
    }


//follow/unfollow button changes

function buttonChange(){
  var element = document.getElementById('stampFollow');

     if (element.value=="follow") element.value = "unfollow";
      else element.value = "follow"; 

     element.toggleClass('unfollow');
}

//submit to tourney button change
function tourneyButtonChange(){
  var element = document.getElementById('tourneyAdd');

     if (element.value=="Submit") element.value = "Submitted";
      else element.value = "Submit"; 
}



function fillBio(){
  var bio = $("input#displayBioEdit").val();
  if(bio == ""){
    $("input#displayBioEdit").val('This is my artist page');
  }
}


function fillName(){
  var name = $("input#displayNameEdit").val();
  if(name == ""){
    $("input#displayNameEdit").val('Anonymous');
  }
}

function fillLocation(){
  var loc = $("input#displayLocationEdit").val();
  if(loc == ""){
    $("input#displayLocationEdit").val('My location is not specified');
  }
}