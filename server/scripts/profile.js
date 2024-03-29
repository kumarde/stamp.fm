$(document).ready(function() {
    $("#db-upload").submit(function(e){
      return false;
    });
    $('#songSubmit').click(function(event){
     var name = $('#songName').val();
     var explicit = $('#explicit').val();
     var genre = $('#genre').val();
	 
	 name = name.replace(/\W/g,"");
	 
	 
     $.ajax({ 
           url: '/db-upload',
           type: 'POST',
           cache: false, 
           data: {name : name, explicit: explicit, genre: genre},
           success: function(data){
            if(data.msg == "saved"){
          var $tr = $('<tr id="song_name" class = "'+data.id+'" style="color:#000"></tr>');
          var $td1 = $('<td></td>');
          var $td2 = $('<td></td>');
          var $td3 = $('<td></td>');
          var $td4 = $('<td></td>');
          var $div = $('<div data-tag ="'+data.id+'" class = "vidPlay" style="width:100px">'+data.name+'</div>');
          var $img1 = $('<img data-name = "'+data.name+'" data-tag ="'+data.id+'" class = "addPlay" src="favoriteIcon.png" style="height:15px;width:15px;float:right;">');
          var $img2 = $('<img data-name = "'+data.name+'" data-tag = "'+data.id+'" class="deletebutton" src="deleteIcon.png" style="height:15px;width:15px;float:right;">');
          var $img3 = $('<input data-genre = "'+data.genre+'" data-name = "'+data.name+'" data-tag = "'+data.id+'" type="button" value="Submit" class="addTourney">');
          $div.click(playVideo);
          $img1.click(addtoPlaylist);
          $img2.click(deleteSong);
          $img3.click(uploadToTourney);
          $td1.append($div);
          $td2.append($img1);
          $td3.append($img2);
          $td4.append($img3);
          $tr.append($td1);
          $tr.append($td2);
          $tr.append($td3);
          $tr.append($td4);
            $("#songTable").append($tr);
            }
            if (typeof data.redirect == 'string'){
              window.location = data.redirect;
            }
           }
        })
     });
    $('.vidPlay').click(playVideo);
    $('.addPlay').click(addtoPlaylist);
    $('.deletebutton').click(deleteSong);
    $('.playdelete').click(deletefromPlaylist);
    $('.addTourney').click(uploadToTourney);
    $('#chName').submit(function(event){
      return false;
    })
    $('#submitNameButton').click(function(event){
      var name = $('#displayNameEdit').val();
	  name = name.replace(/\W/g,"");
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
	  bio = bio.replace(/\W/g,"");
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
	  loc = loc.replace(/\W/g,"");
      $.ajax({
        url: '/changeLocation',
        type: 'POST',
        cache: false,
        data: {editLocation: loc}
      })
    })
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
            $(".p"+data.id).remove();
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