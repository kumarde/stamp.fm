  $(document).ready(function() {
    $("#profileUpload").submit(function(e){
      return false;
    });


    $('#chName').submit(function(event){
      return false;
    })

    $('#chBio').submit(function(event){
      return false;
    })

    $('#chLoc').submit(function(event){
      return false;
    })
	
	
	$('.vidPlay').click(playVideo);
    $('.addPlay').click(addtoPlaylist);

	
	
	var l = $("#playlistContent").find('.songname').length;
	for ( var i = 0; i < l; i++){
		PlaylistData($($("#playlistContent").find('.songname')[i]).attr('data-tag'), i);
	}
	
	$('.stampFollow').click(function(e){
		if ($(this).val() == "Follow"){$(this).val("Unfollow");follow(e);}
		else {$(this).val("Follow");unfollow(e);}
	});
	
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
  
  
	function PlaylistData(sid,i){
		$.ajax({
        url: '/pldata',
        type: 'POST',
        cache: false,
        data: {sid: sid},
        success: function(data){
			$span = $("<span id='aname'>"+data.artistName+"</span>");
			$($("#playlistContent").find('.songname')[i]).prepend(" - ");
			$($("#playlistContent").find('.songname')[i]).prepend($span);
			
			$span.click(function(){window.location = "/view?id="+data.artistID;});
        }
      })
	}
  
  $('#voteTwo').click(function(){
    var sid = $(this).attr('data-tag');
    $.ajax({
      url: '/profileVote',
      type : 'POST',
      cache: false,
      data: {sid: sid},
      success: function(data){
        $(this).attr('src', 'votedd.png');
      }
    })
  })

  function switchdown(){
    if($('#voteTwo').attr('src') == 'vote.png' && $("#voteOne").attr('src') == 'vote.png'){
      $(this).attr('src', 'voted.png');
    }
  }

  function switchup(){
  if(($("#voteTwo").attr('src') == 'vote.png' && $("#voteOne").attr('src') == 'vote.png') || $(this).attr('src') == 'voted.png')  {
      $(this).attr('src', 'votedd.png');
    }
  }
function changeback(){
  $("#voteTwo").attr('src', 'vote.png');
  $("#voteOne").attr('src', 'vote.png');
 }