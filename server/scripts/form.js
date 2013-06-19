alert("vijay!");
$(document).ready(function() {
	alert("vijaydd");
	// Also note, that for $('#sample').myplugin() to work
// you need the element with id "sample" to be existent
// so the function is actually called
(function($){
  $.fn.myplugin = function(){
    // in your code, the `this` is pointing to 
    // jQuery object, you can't access `id` attribute
    // with dot. You need to either access first element
    // in jQuery object (`this[ 0 ]`) or use this.attr('id')
    // alert( this[0].id );
    alert("vijay");
  };
})(jQuery);
$(document).myplugin();

});