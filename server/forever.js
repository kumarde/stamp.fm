var forever = require('forever-monitor');

var child = new(forever.Monitor)('server.js',{
	max: 3,
	silent: true,
	options:[{'watch': true, 'watchIgnoreDotFiles': null, 'watchIgnorePatterns': null, 'watchDirectory':'.'}] //watch = true?
});

child.on('exit', function(){
	console.log('server.js has exited after 3 restarts');
});

child.start();