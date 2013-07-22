var $del;
$(document).ready(function() {

    $('#songSubmit').click(function(event){
		
	 if ( $('#songName').val() != ""){
	 
     var name = $('#songName').val();
     var explicit = $('#explicit').val();
     var genre = $('#genre').val();
	 
	 name = name.replace("[^a-zA-Z0-9 \s]","");
	 
	 $("#upname").val(name);
	 $("#upgenre").val(genre);
	 $("#upex").val(explicit);
	 
	 $('#uploadForm').submit();
	 $("#songSubmit").css("display","none");
	 $("#cancelUpload").css("display","none");
	 $("#holder").html("Please wait your while video uploads");
	 }
	 
     });
	
    $('.vidPlay').click(playVideo);
    $('.addPlay').click(addtoPlaylist);
    $('.deletebutton').click(function(){$("#songdel").addClass("unhidden");
										$("#syes").attr('data-tag',$(this).attr('data-tag'));
		});
    $('.playdelete').click(function(){$("#playdel").addClass("unhidden");
		$("#pyes").attr('data-tag',$(this).attr('data-tag'));
		$del = $(this);
	
	});
	$("#syes").click(deleteSong);
	$("#pyes").click(deletefromPlaylist);
	$(".but").click(function(){$("#songdel").removeClass("unhidden");
								$("#playdel").removeClass("unhidden");
	});
	
    $('.addTourney').click(uploadToTourney);
    $('#chName').submit(function(event){
      return false;
    });
    $('#submitNameButton').click(function(event){
      var name = $('#displayNameEdit').val();
	  name = name.replace("[^a-zA-Z0-9 \s]","");
      $.ajax({
        url: '/changeName',
        type: 'POST',
        cache: false,
        data: {editName: name}
      });
    });
    $('#chBio').submit(function(event){
      return false;
    });
    $('#submitBioButton').click(function(event){
      var bio = $('#displayBioEdit').val();
	  bio = bio.replace("[^a-zA-Z0-9 \s]","");
      $.ajax({
        url: '/changeBio',
        type: 'POST',
        cache: false,
        data: {editBio: bio}
      });
    });
    $('#chLoc').submit(function(event){
      return false;
    });
    $('#submitLocationButton').click(function(event){
      var loc = $('#displayLocationEdit').val();
	  loc = loc.replace("[^a-zA-Z0-9 \s]","");
      $.ajax({
        url: '/changeLocation',
        type: 'POST',
        cache: false,
        data: {editLocation: loc}
      });
    });
	

	var l = $("#playlistContent").find('.songname').length;
	for ( var i = 0; i < l; i++){
		PlaylistData($($("#playlistContent").find('.songname')[i]).attr('data-tag'), i);
	}
	
	
	
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
        success: function(data){
          /*var htmlRow = ['<tr id="playlist_name" class = "p'+data.id+'">',
          '<td>', '<div style="width:250px;" data-tag ="'+data.id+'" id= "vidPlay">'+data.name+'</div>', '</td>',
          '<td>', '<img data-tag = "'+data.id+'" class="playdelete" id = "'+data.id+'" src="http://cdn2.iconfinder.com/data/icons/picons-essentials/71/plus-512.png" style="height:20px;width:25px;float:right;-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);">', '</td>','</tr>'];*/
          var $trp = $('<tr id="playlist_name" class = "p'+data.id+'"></tr>');
          var $td1p = $('<td></td>');
          var $td2p = $('<td></td>');
          var $divp = $('<div style="width:100px;" data-tag ="'+data.id+'" class= "vidPlay">'+data.name+'</div>');
          var $imgp = $('<img data-tag = "'+data.id+'" class="playdelete" id = "'+data.id+'" src="favoriteRemove.png" style="height:15px;width:15px;float:right;">');

          $divp.click(playVideo);
          $imgp.click(deletefromPlaylist);
          $td1p.append($divp);
          $td2p.append($imgp);
          $trp.append($td1p);
          $trp.append($td2p);
          $("#playlistTable").append($trp);
        }
      })
  }

  function deleteSong(){
      var tag = $(this).attr('data-tag');
      var name = $(this).attr('data-name');
      $.ajax({
        url: '/deleteSong',
        type: 'POST',
        cache: false,
        data: {id: tag, name: name},
        success: function(data){
          if(data.msg == "yes"){
            $("."+data.id).remove();
            $("#"+data.id).trigger("click");
          }
          else if(data.msg == "no"){
            $('div#delerror').addClass("unhidden");
          }
        }
      })
  }

  function deletefromPlaylist(){
      var tag = $(this).attr('data-tag');
      $.ajax({
        url: '/playDelete',
        type: 'POST',
        cache: false,
        data: {id: tag},
        success: function(data){
          if(data.msg){
            //$(".p"+data.id).remove();
			$del.parent().parent().remove();
          }
        }
      });
   }
   function uploadToTourney(){
      var name = $(this).attr('data-name');
      var sid = $(this).attr('data-tag');
      var genre = $(this).attr('data-genre');
      $.ajax({
        url: '/tournament',
        type: 'POST',
        cache: false,
        data: {name: name, id: sid, genre: genre},
        success: function(data){
            if(data.msg == "no"){
              $('div#samesong').addClass("unhidden");
            }
            else{
              $('div#congrats').addClass("unhidden");
            }
        }
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
			
			if (sid != "0")$span.click(function(){window.location = "/view?id="+data.artistID;});
        }
      })
	}
	  