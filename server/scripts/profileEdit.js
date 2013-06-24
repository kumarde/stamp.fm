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
      if ( document.getElementById('submitBioButton').style.visibility == 'hidden' ) {
            document.getElementById('submitBioButton').style.visibility= 'visible';
          } else {
            document.getElementById('submitBioButton').style.visibility = 'hidden';
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