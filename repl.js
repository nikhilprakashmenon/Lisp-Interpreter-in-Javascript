var repl = require('repl');

// App specific module
var lispInterpreter = require('./Lispify');

var context   = lispInterpreter.context;
var Parse     = lispInterpreter.Parse;
var Evaluate  = lispInterpreter.Evaluate;
var Lispify   = lispInterpreter.Lispify;

// Default evaluator for Lisp expressions
var defaultEvaluator = function(cmd, context, filename, callback) {
	var result = Lispify.call(context, String(cmd));
	callback(null, result || "No Output");
};

// Start REPL server with the given prompt
var replServer = repl.start({
	prompt: "lispify > ",
	eval: defaultEvaluator
});

// Attaching module to REPL context
replServer.context.Parse    = Parse;
replServer.context.Evaluate = Evaluate;
replServer.context.Lispify  = Lispify;

// The command is invoked by typing .about. Displays an info about lispify program
replServer.defineCommand('about', {
	help: 'about lispify',
	action: function() {
		console.log('\n\tLisp (Scheme dialect) Interpreter implemented in Javascript. \n\tYou can view the source code at https://github.com/nikhilprakashmenon/Lisp-Interpreter-in-Javascript\n');
		this.displayPrompt();
	}
});

// The command is invoked by typing .commands. Displays all the available commands
replServer.defineCommand('commands', {
	help: 'Available Commands',
	action: function() {
		console.log('\n\tDefault  - uses Lispify() to interpret the entered expression\n');
		this.displayPrompt();
	}
});

// On exit -  Ctrl + d / .exit
replServer.on('exit', function(){
	console.log('Exiting from repl for Lispify!\n');
	process.exit();
});