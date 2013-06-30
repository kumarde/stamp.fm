$(document).ready(function(){

	$('#feedback').submit(function(event){
		alert("stopped");
		return false;
	});
	
	$('#feedbacksubmit').click(function(event){
		var category = $('input:radio[name=feedback]:checked').val();
		var feedback = $('#feedbackMessage').val();
		$.ajax({
			url : '/feedback',
			type: 'POST',
			cache: false,
			data: {category: category, feedback: feedback},
			success: function(data){}
		});
	});


});