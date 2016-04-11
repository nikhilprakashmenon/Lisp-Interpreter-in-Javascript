var repl = require('repl');

// Default evaluator for Lisp expressions
var defaultEvaluator = function(cmd, context, filename, callback) {
	var result = Lispify(String(cmd));
	callback(null, result);
};

// Start REPL server with the given prompt
var replServer = repl.start({

	prompt: "lispify > ",
	eval: defaultEvaluator
});

// App specific module
var lispInterpreter = require('./Lispify');

var Parse     = lispInterpreter.Parse;
var Evaluate  = lispInterpreter.Evaluate;
var Lispify   = lispInterpreter.Lispify;

// Attaching module to REPL context
replServer.context.Parse = Parse;
replServer.context.Evaluate = Evaluate;
replServer.context.Lispify = Lispify;

//The command is invoked by typing .about. Displays an info about lispify program
replServer.defineCommand('about', {
	help: 'about lispify',
	action: function() {
		console.log('\n\tLisp (Scheme dialect) Interpreter implemented in Javascript. \n\tYou can view the source code at https://github.com/nikhilprakashmenon/Lisp-Interpreter-in-Javascript\n');
		this.displayPrompt();
	}
});

//The command is invoked by typing .commands. Displays all the available commands
replServer.defineCommand('commands', {
	help: 'Available Commands',
	action: function() {
		console.log('\n\t1. Lispify()    - interprets a lisp statement');
		console.log('\n\t2. Parse()      - parses a lisp statement');
		console.log('\n\t3. Evaluate()   - evaluates a lisp ast (abstract syntax tree)\n');
		this.displayPrompt();
	}
});

// On exit -  Ctrl + d / .exit
replServer.on('exit', function(){
	console.log('Exiting from repl for Lispify!\n');
	process.exit();
});






