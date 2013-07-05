var forever = require('forever-monitor');

var child = new(forever.Monitor)('server.js',{
	max: 1,
	silent: false,
	watch: true,
	killTree: true,
	watchIgnoreDotFiles: null,
	watchIgnorePatterns: null,
	watchDirectory: __dirname,
	options: [] //watch = true?
});

child.on('exit', function(){
	console.log('server.js has exited after 3 restarts');
});

child.on('restart', function(){
	console.log("restarted the server.");
})


child.start();