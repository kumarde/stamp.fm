var time = 0;
var vid1watch = 0;
var vid2watch = 0;
var t;
var v = 0;

function votesel(){

$("#songOneVote").toggle();
$("#songTwoVote").toggle();

}

function t1(){
	clearTimeout(t);
	t = setTimeout(function(){vid1watch = 1; if(vid1watch && vid2watch)votesel(); },1000);
}

function t2(){
	clearTimeout(t);
	t = setTimeout(function(){vid2watch = 1; if(vid1watch && vid2watch)votesel();},1000);
}

$(document).ready(function(){

$("#songOneVote").toggle();
$("#songTwoVote").toggle();
$("#next").toggle();

$('#playVidOne').click(function(e){
		
		$.ajax({
			url: "/vidPlay2",
			type: "POST",
			cache: false,
			data: {video: $(this).attr('data-tag')},
			success: function(data){
				var $vid_obj = _V_("vidYo");
				$vid_obj.ready(function(){
					$vid_obj.pause();
					$('#vidYo').find('#source').attr('src', data.video);
					$('#vidYo').removeClass('vjs-playing').addClass('vjs-paused');
					$vid_obj.load();
					$('#div_video_html5_api').show();
				});
				if (!vid1watch)t1();
			}
		});
	});
	$('#playVidTwo').click(function(e){
		
		$.ajax({
			url: "/vidPlay2",
			type: "POST",
			cache: false,
			data: {video: $(this).attr('data-tag')},
			success: function(data){
				var $vid_obj = _V_("vidYo");
				$vid_obj.ready(function(){
					$vid_obj.pause();
					$('#vidYo').find('#source').attr('src', data.video);
					$('#vidYo').removeClass('vjs-playing').addClass('vjs-paused');
					$vid_obj.load();
					$('#div_video_html5_api').show();
				});
				if(!vid2watch)t2();
			}
		});
	});
	$('#voteOne').click(function(){
		if ( !v ){
			v = 1;
			$.ajax({
				url: "/testvote",
				type: "POST",
				cache: false,
				data: {vid: $(this).attr('data-tag')},
				success: function(data){
				$("#tenSecs").toggle();
				$('#next').toggle();
				}
			});
		}
	});
	$('#voteTwo').click(function(){
		if ( !v ){
			v = 1;
			$.ajax({
				url: "/testvote",
				type: "POST",
				cache: false,
				data: {vid: $(this).attr('data-tag')},
				success: function(data){
				$("#tenSecs").toggle();
				$('#next').toggle();
				}
			});
		}
	});
	$('#next').click(function(){
		$.ajax({
			url: "/playNext",
			type: "POST",
			cache: false,
			success: function(data){
				$("#vidOne").html(data.s1);
				$("#vidTwo").html(data.s2);
				$("#artistOne").html(data.a1);
				$("#artistTwo").html(data.a2);
				$('#subartist1').html(data.a1);
				$('#subartist2').html(data.a2);			
				$('#playVidOne').attr('data-tag', data.v1id);
				$('#playVidTwo').attr('data-tag', data.v2id);
				$('#voteOne').attr('data-tag', data.v1id);
				$('#voteTwo').attr('data-tag', data.v2id);
				$('#one').html(data.votes1);
				$('#two').html(data.votes2);
				$("#tenSecs").toggle();
				$('#next').toggle();
				votesel();
				vid1watch = 0;
				vid2watch = 0;
				v = 0;
				
				var $vid_obj = _V_("vidYo");
				$vid_obj.ready(function(){
					$vid_obj.pause();
					$vid_obj.get(0).currenTime = 0;
				});
			}
		});
	});
});
    function openBanOne()
    {
      if ( document.getElementById('banContentOne').style.visibility == 'hidden' ) {
            document.getElementById('banContentOne').style.visibility= "visible";
          } else {
            document.getElementById('banContentOne').style.visibility = 'hidden';
          }   
    }


    function openBanTwo()
    {
      if ( document.getElementById('banContentTwo').style.visibility == 'hidden' ) {
            document.getElementById('banContentTwo').style.visibility= "visible";
          } else {
            document.getElementById('banContentTwo').style.visibility = 'hidden';
          }   
    }

    function addControls()
    {
    	var whereYouAt = myPlayer.currentTime();
    	element = document.getElementById('vidYo');

    	if (whereYouAt >= 10000){
    		element.attributeName = 'controls';
    	}
    }