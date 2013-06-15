var validator = new FormValidator('new-account', [{
	name:'name',
	rules: 'required'
}, { name:'email',
	 rules:'valid_email'
}, { name: 'user',
	 rules: 'required', 'greater_than[6]'
}, {
	 name: 'pass',
	 rule: 'required', 'greater_than[6]', 'alpha_dash'
}, {
	 name: 'pass-confirm',
	 display: 'password confirmation',
	 rule: 'required|matches[password]'
}],
	function(err, event){
		if(errors.length > 0){
			var errorString = '';
			for(var i = 0; errorLength = errors.length; i < errorLength; ++i){
				errorString += errors[i].message + '<br />';
			}
			el.innerHTML = errorString;
		}
});