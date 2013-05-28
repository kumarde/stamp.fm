$( document ).ready(function() {
      $('#enter').click(function(){  

     $.ajax({ 
           url: '/ajax',
           type: 'POST',
           cache: false, 
           data: { field1: 1, field2: 2 }, 
           success: function(data){
              alert(data.message)
           }
           , error: function(jqXHR, textStatus, err){
               alert('text status '+textStatus+', err '+err)
           }
        })
     });
});