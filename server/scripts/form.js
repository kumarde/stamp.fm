$(document).ready(function(){
	var errorMsg = <%= error %>;
	if(errorMsg) alert(errorMsg);
});