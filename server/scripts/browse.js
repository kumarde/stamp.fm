$(document).ready(function(){
generateSongs();
$('.vidPlay').click(playVideo);
$('.addPlay').click(addtoPlaylist);
$('#followmothafucka').click(follow);

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
function follow1(event) {
    $.ajax({ 
      url: '/follow',
      type: 'POST',
      cache: false, 
      data: { id: event.target.id},
      success: function(data){
        if (typeof data.redirect == 'string' )console.log(data.redirect);
        else if (typeof data.error == 'string')console.log(data.error);
        else console.log(data);
      }
    });
  }

  function unfollow1(event) {
    $.ajax({ 
      url: '/unfollow',
      type: 'POST',
      cache: false, 
      data: { id: event.target.id},
      success: function(data){
        if (typeof data.redirect == 'string' )console.log(data.redirect);
        else if (typeof data.error == 'string')console.log(data.error);
        else console.log(data);
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
function changeUp(event){
  $($(this).find('#foll')).attr('id', $(this).attr('profID'));
}
/*function buttonChange(){
  alert("sdfsdfsdf");
  if($(this).attr('value') == 'Follow'){
    $(this).attr('value', 'Unfollow');
  }
  else{
    $(this).attr('value', 'Follow')
  }
}*/

function generateSongs(){
    $.ajax({
        url: '/songGen',
        type: 'POST',
        cache: false,
        success: function(data){
          for(var i = 0; i < data.songs.length; ++i){
            var $tr = $('<tr id="song_name" style="color:#000; border-bottom: 2px solid;" class = "'+data.songs[i]._id+'"></tr>');
            var $div = $('<div data-tag ="'+data.songs[i]._id+'" class = "songname" style="float:left;">'+data.songs[i].name+'</div>');
            var $img = $('<img data-name = "'+data.songs[i].name+'" data-tag ="'+data.songs[i]._id+'" class = "vidPlay" src="play.jpg" style="float:right;height:15px;width:15px;-moz-border-radius:10px;border-radius: 10px;-webkit-border-radius: 10px;">');
            var $img1 = $('<img data-name = "'+data.songs[i].name+'" data-tag ="'+data.songs[i]._id+'" class = "addPlay" src="favoriteIcon.png" style="float:right;height:15px;width:15px;-moz-border-radius:10px;border-radius: 10px;-webkit-border-radius: 10px;"><br>');
            $img.click(playVideo);
            $img1.click(addtoPlaylist);
            $tr.append($div);
            $tr.append($img);
            $tr.append($img1);
            $("#songList").append($tr);
            var $artist = $('<div class="artist"></div>');
            console.log(data.profiles[i]);
            var $imgart = $('<img num = "'+i+'"name = "'+data.profiles[i].name+'" profID = "'+data.profiles[i]._id+'" data-name = "'+data.songs[i].name+'" data-tag ="'+data.songs[i]._id+'" class="artist_pic" src="'+data.profiles[i].url+'" style="height:100%;width:100%;"><br>');
            var $ul = $('<ul id="songInfo"></ul>');
            var $li = $('<li><span class="song_name">'+data.songs[i].name+'</span></li><br>');
            var $li1 = $('<li data-tag= "'+data.profiles[i]._id+'"><span class="artist_name">'+data.profiles[i].name+'</span></li>');
            if(data.profiles[i]._id == data.id){
              console.log("this happens");
              var $follow = $('<div data-tag = "'+i+'" id = "foll" class="stampFollow"></div>');
            }
            else if (data.profiles[i].followers.indexOf(data.id) == -1 ){
              console.log(data.id);
              var $follow = $('<input type="button" data-tag = "'+i+'" value="Follow" id = "'+data.profiles[i]._id+'" class="stampFollow">');
            }
            else{
              console.log("fuck you");
              var $follow = $('<input type="button" data-tag = "'+i+'" value="Unfollow" id = "'+data.profiles[i]._id+'" class="stampFollow">');
            }
            $follow.hide();
           $('#selected_pic').append($follow);
            $li1.click(function(){window.location = "/view?id="+$(this).attr('data-tag');});
            $imgart.click(function(){$("#artistNameSelected").html($(this).attr('name'));$("#imgid").attr('src', $(this).attr('src'));});
            $imgart.click(playVideo);
            $imgart.click(function(){
              var l = $('#selected_pic').find('input').length;
              for (var i = 0; i < l; ++i){
                 if ( $(this).attr('num') == $($('#selected_pic').find('input')[i]).attr('data-tag') )$($('#selected_pic').find('input')[i]).show();
                 else $($('#selected_pic').find('input')[i]).hide();
               }
            })
            if($follow.attr("value") == "Follow"){
              $follow.click(follow1);
              $follow.click(function(){
                $(this).val('Unfollow');
              })
            }
            else{
              $follow.click(unfollow1);
              $follow.click(function(){
                $(this).val('Follow');
              })
            }
            $ul.append($li);
            $ul.append($li1);
            $artist.append($imgart);
            $artist.append($ul);
            $("#artists").append($artist);
          }
        }
    });
}


