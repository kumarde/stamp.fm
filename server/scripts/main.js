$( document ).ready(function() {

      $('#button').click(function () {       
        $.post('/vote/', { 
         stuff: {"id": $('#div1vote').html()}}, callback, "json");
      });

      $('#vote1').submit(function(){
        $.ajax({ 
             url: '/vote',
             type: "POST",
             cache: false,
             data: $('div#div1vote').html();
             success: function(data){
                    alert(data.name)
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