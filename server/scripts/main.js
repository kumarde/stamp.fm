$(document).ready(function() {
    $('#enter').click(function(){  
     $.ajax({ 
           url: '/vote',
           type: 'POST',
           cache: false, 
           data: { vid: $('#div1vote').html()},
           success: function(data){
            $('#div1vote').html(data.v1id);
            $('#div2vote').html(data.v2id);
           }
        })
     });
    $('#enter2').click(function(){  
     $.ajax({ 
           url: '/vote',
           type: 'POST',
           cache: false, 
           data: { vid: $('#div2vote').html()},
           success: function(data){
            $('#div1vote').html(data.v1id);
            $('#div2vote').html(data.v2id);
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