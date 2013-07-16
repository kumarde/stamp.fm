$(document).ready(function(){

$('.vidPlay').click(playVideo);
$('.addPlay').click(addtoPlaylist);
});



function playVideo(){
      var tag = $(this).attr('data-tag');
      $.ajax({
        url: '/vidPlay',
        type: 'POST',
        cache: false,
        data: {video : tag},
        success: function(data){
        var $vid_obj = _V_("vidYo");
        $vid_obj.ready(function() {
        $vid_obj.pause();
        $('#vidYo').find("#source").attr("src", data.video);
        $(".vjs-big-play-button").show();
        $("#vidYo").removeClass("vjs-playing").addClass("vjs-paused");
        $vid_obj.load();
        $("#div_video_html5_api").show();
    });
    
        }
      });
  }

function addtoPlaylist(){
      var tag = $(this).attr('data-tag');
      var name = $(this).attr('data-name');
      console.log(tag);
      console.log(name);
      $.ajax({
        url: '/addPlay',
        type: 'POST',
        cache: false,
        data: {sid: tag, name: name},
      })
  }



