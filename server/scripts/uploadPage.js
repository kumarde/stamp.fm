    function openDropdown()
    {
      if ( document.getElementById('dropdownContent').style.visibility == 'hidden' ) {
            document.getElementById('dropdownContent').style.visibility= 'visible';
          } else {
            document.getElementById('dropdownContent').style.visibility = 'hidden';
          }   
    }

      function rotate() 
      {
          if(document.getElementById('settings').hasClass("rotate")==true){
          	document.getElementById('settings').removeClass("rotate");
          } else{
          	document.getElementById('settings').addClass("rotate");
          }
      }