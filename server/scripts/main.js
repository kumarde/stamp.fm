$( document ).ready(function() {
      $('#vote1').click(function(){
      $.ajax({ 
           url: '/ajax',
           type: 'POST',
           cache: false,
           success: function(data){
                  alert(data.message)
           }
           , error: function(jqXHR, textStatus, err){
               alert('text status '+textStatus+', err '+err)
           }
      })
      });
      
});
function expandFooter(){
        if(document.getElementById("expandedFooter").style.display=='none'){
            document.getElementById("expandedFooter").style.display='inline';
        }else{
            document.getElementById("expandedFooter").style.display='none';
        }
}