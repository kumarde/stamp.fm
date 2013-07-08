var forever = require('forever-monitor');

var child = new(forever.Monitor)('/home/ec2-user/stamp.fm/server/server.js',{
	max: 500,
	silent: false,
	watch: true,
	killTree: true,
	watchIgnoreDotFiles: null,
	watchIgnorePatterns: null,
	watchDirectory: __dirname,
	options: [], //watch = true?
	logFile: '/home/ec2-user/stamp.fm/logs/log.out',
	outFile: '/home/ec2-user/stamp.fm/logs/out.log',
	errFile: '/home/ec2-user/stamp.fm/logs/err.log'
});

child.on('error', function(){
	child.restart();
});

child.on('exit', function(){
	console.log('server.js has exited after 3 restarts');
});

child.on('restart', function(){
	console.log("restarted the server.");
})


child.start();
