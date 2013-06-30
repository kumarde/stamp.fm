  $(document).ready(function() {
    $("#profileUpload").submit(function(e){
      return false;
    });
    $('#songSubmit').click(function(event){ 
     var name = $('#songName').val();
     $.ajax({ 
           url: '/profileUpload',
           type: 'POST',
           cache: false, 
           data: {name : name},
           success: function(data){
            if(data.msg == "saved"){
              alert("Your song has been saved!");
            }
            if (typeof data.redirect == 'string'){
              window.location = data.redirect;
            }
           }
        })
     });
    $('.vidPlay').click(function(event){
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
    });
    $('.addPlay').click(function(event){
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
          alert(data.name + "was added to your Playlist");
        }
      })
    })
    $('.deletebutton').click(function(event){
      var tag = $(this).attr('data-tag');
      $.ajax({
        url: '/deleteSong',
        type: 'POST',
        cache: false,
        data: {id: tag},
        success: function(data){
          if(data.msg == "yes"){
            alert("You have successfully deleted this song.");
          }
          else if(data.msg == "no"){
            alert("You cannot delete a video uploaded to the tournament.");
          }
        }
      })
    })
    $('.playdelete').click(function(event){
      var tag = $(this).attr('data-tag');
      $.ajax({
        url: '/playDelete',
        type: 'POST',
        cache: false,
        data: {id: tag},
        success: function(data){
          if(data.msg){
            alert("You have successfully deleted this song from your playlist.");
          }
        }
      });
    });
    $('#chName').submit(function(event){
      return false;
    })
    $('#submitNameButton').click(function(event){
      var name = $('#displayNameEdit').val();
      $.ajax({
        url: '/changeName',
        type: 'POST',
        cache: false,
        data: {editName: name}
      })
    })
    $('#chBio').submit(function(event){
      return false;
    })
    $('#submitBioButton').click(function(event){
      var bio = $('#displayBioEdit').val();
      $.ajax({
        url: '/changeBio',
        type: 'POST',
        cache: false,
        data: {editBio: bio}
      })
    })
    $('#chLoc').submit(function(event){
      return false;
    })
    $('#submitLocationButton').click(function(event){
      var loc = $('#displayLocationEdit').val();
      $.ajax({
        url: '/changeLocation',
        type: 'POST',
        cache: false,
        data: {editLocation: loc}
      })
    })
  });