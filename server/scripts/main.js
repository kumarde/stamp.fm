$( document ).ready(function() {
      $('#vote1').click(function(){
      $.ajax({ 
           url: '/ajax',
           type: 'POST',
           cache: false,
           data: { field1: 1 },
           success: function(data){
                  alert(data.message)
           }
           , error: function(jqXHR, textStatus, err){
               alert('text status '+textStatus+', err '+err)
           }
      })
      });
});