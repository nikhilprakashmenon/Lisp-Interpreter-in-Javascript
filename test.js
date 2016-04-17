var   lispInterpreter = require('./Lispify');

var globalVar = lispInterpreter.globalVar;
var Parse     = lispInterpreter.Parse;
var Evaluate  = lispInterpreter.Evaluate;
var Lispify   = lispInterpreter.Lispify;
var context   = lispInterpreter.context;



testParser();
testInterpreter();


/*
==============================================================================================================
										 	    PARSER TEST FUNCTIONS
==============================================================================================================
*/

function testParser() {

	(function parseSpecialForm() {

		callDefine();
		callIf();
		callQuote();
		callProcedure();

		function callDefine(){
			console.log("\nDefine Special Form\n\n")
			console.log("Program: " + "(define value 10)");
			console.log(Parse.call(context, "(define value 10)"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define twice (lambda (a b) (* a b)))");
			console.log(Parse.call(context, "(define twice (lambda (a b) (* a b)))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define twice (lambda (a b) (* a (+ 1 2))))");
			console.log(Parse.call(context, "(define twice (lambda (a b) (* a (+ 1 2))))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (* 3 2))))");
			console.log(Parse.call(context, "(define repeat (lambda (f) (lambda (x) (* 3 2))))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (f (f x)))))");
			console.log(Parse.call(context, "(define repeat (lambda (f) (lambda (x) (f (f x)))))"));

			
			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))");
			console.log(Parse.call(context, "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))");
			console.log(Parse.call(context, "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))"));
		}

		function callIf(){
			console.log("\nIf Special Form\n\n")
			console.log("Program: " + "(if (> id1 id2) (* 7 6) (+ 10 50))");
			console.log(Parse.call(context, "(if (> id1 id2) (* 7 6) (+ 10 50))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(if (> (* 11 11) (+ a b)) (* 7 6) (+ 1 2))");
			console.log(Parse.call(context, "(if (> (* 11 11) (+ a b)) (* 7 6) (+ 1 2))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(if (> (* 11 11) 120) (* 7 (/ 1 2)) (+ 1 2))");
			console.log(Parse.call(context, "(if (> (* 11 11) 120) (* 7 (/ 1 2)) (+ 1 2))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n 10))))");
			console.log(Parse.call(context, "(define fact (lambda (n) (if (<= n 1) 1 (* n 10))))"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "(define fact (lambda (n) (if (>= n (+ 1 1)) 1 (* n 10))))");
			console.log(Parse.call(context, "(define fact (lambda (n) (if (>= n (+ 1 1)) 1 (* n 10))))"));
		}

		function callQuote(){
			console.log("\nQuote Special Form\n\n")
			console.log("Program: " + "(quote the)");
			console.log(Parse.call(context, "(quote the)"));

			console.log("\n-----------------------------------------------\n");
		}

		function callProcedure(){
			console.log("\n Procedure Call\n\n")
			console.log("Program: " + "(pow 2 16)");
			console.log(Parse.call(context, "(pow 2 16)"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "((repeat twice) 10)");
			console.log(Parse.call(context, "((repeat twice) 10)"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "((repeat (repeat twice)) 10)");
			console.log(Parse.call(context, "((repeat (repeat twice)) 10)"));

			console.log("\n-----------------------------------------------\n");

			console.log("Program: " + "((repeat (repeat (repeat twice))) 10)");
			console.log(Parse.call(context, "((repeat (repeat (repeat twice))) 10)"));

			console.log("\n-----------------------------------------------\n");
		}
	})();

	(function parseArithExp() {
		// Valid expressionSyntax
		console.log("Valid expressionSyntax\n");

		console.log("Program: " + "(* identifier1 10)");
		console.log(Parse.call(context, "(* identifier1 10)"));

		console.log('----------------------------------------');

		console.log("Program: " + "(+ identifier1 ( / 3 2))");
		console.log(Parse.call(context, "(+ identifier1 ( / 3 2))"));
		console.log('----------------------------------------');

		console.log("Program: " + "(+ identifier1 ( / 3 ( * id1 id2 )))");
		console.log(Parse.call(context, "(+ identifier1 ( / 3 (* id1 id2 )))"));

		// Invalid expressionSyntax
		console.log("\n\n\nInvalid expressionSyntax\n");

		console.log("Program: " + "(* identifier1 10 10)");
		console.log(Parse.call(context, "(* identifier1 10 10)"));

		console.log('----------------------------------------');
		console.log("Program: " + "(* identifier1 (/ / 2) 5)");
		console.log(Parse.call(context, "(* identifier1 (/ / 2) 5)"));

		console.log('----------------------------------------');
		console.log("Program: " + "(* 10)");
		console.log(Parse.call(context, "(* 10)"));

		//Invalid Identifiers
		console.log("\n\n\nInvalid Identifiers\n");

		console.log("Program: " + "(* identifier$ 10 10)");
		console.log(Parse.call(context, "(* identifier$ 10 10)"));
	})();

	(function parsePeterNorvigIO() {

		console.log("\nInput Output - Peter Norvig\n\n")
		console.log("Program: " + "(define circle-area (lambda (r) (* pi (* r r))))");
		console.log(Parse.call(context, "(define circle-area (lambda (r) (* pi (* r r))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(circle-area 3)");
		console.log(Parse.call(context, "(circle-area 3)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))");
		console.log(Parse.call(context, "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))"));

		console.log("Program: " + "(fact 100)");
		console.log(Parse.call(context, "(fact 100)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(circle-area (fact 10))");
		console.log(Parse.call(context, "(circle-area (fact 10))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define twice (lambda (x) (* 2 x)))");
		console.log(Parse.call(context, "(define twice (lambda (x) (* 2 x)))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (f (f x)))))");
		console.log(Parse.call(context, "(define repeat (lambda (f) (lambda (x) (f (f x)))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "((repeat twice) 10)");
		console.log(Parse.call(context, "((repeat twice) 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "((repeat (repeat (repeat twice))) 10)");
		console.log(Parse.call(context, "((repeat (repeat (repeat twice))) 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(pow 2 16)");
		console.log(Parse.call(context, "(pow 2 16)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))");
		console.log(Parse.call(context, "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(range 0 10)");
		console.log(Parse.call(context, "(range 0 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(range 1 10)");
		console.log(Parse.call(context, "(range 1 10)"));

		console.log("\n-----------------------------------------------\n");
	})();

	(function parseProgram() {

		console.log("\n Complete Programs\n\n");

		console.log("Program: " + "(define circle-area 10)(circle-area 3)");
		console.log(Parse.call(context, "(define circle-area 10)(circle-area 3)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define circle-area (lambda (r) (* pi (* r r))))(circle-area 3)");
		console.log(Parse.call(context, "(define circle-area (lambda (r) (* pi (* r r))))(circle-area 3)"));

		console.log("\n-----------------------------------------------\n");

		// console.log("Program: " + "(circle-area 3)");
		// console.log(Parse.call(context, "(circle-area 3)"));
	})();
}

/*
==============================================================================================================
										      INTERPRETER TEST FUNCTIONS
==============================================================================================================
*/

function testInterpreter() {

	(function interpretArithmetic() {

		console.log("\n\t INTERPRETING ARITHMETIC EXPRESSIONS \n");

		var input = "(* ( + 2 3) (/ 10 (+ 1 1)))";

		console.log("Input: " + input);
		console.log("Output: " + Lispify.call(context, input));

		console.log("=======================================================\n");
	})();

	(function interpretDefine() {

		console.log("\n\t INTERPRETING DEFINE EXPRESSIONS \n");

		var input1 = "(define value 10)";
		var input2 = "(+ value 50)"

		console.log("Input1: " + input1);
		console.log("Input2: " + input2);

		Lispify.call(context, input1);

		console.log("Output: " + Lispify.call(context, input2));

		console.log("=======================================================\n");
	})();

	(function interpretIf() {

		console.log("\n\t INTERPRETING IF EXPRESSIONS \n");

		var input1 = "(if (= 10 10) (* 7 6) (+ 10 (/ 10 5)))";
		var input2 = "(if (<= 100 10) (+ 10 10) (- 20 (/ 10 5)))"

		console.log("Input: " + input1);
		console.log("Output: " + Lispify.call(context, input1));

		console.log("=======================================================\n");

		console.log("Input: " + input2);
		console.log("Output: " + Lispify.call(context, input2));

		console.log("=======================================================\n");
	})();

	(function interpretQuote() {

		console.log("\n\t INTERPRETING QUOTE EXPRESSIONS \n");	

		var input1 = "(quote (+ 1 2))";

		console.log("Input: " + input1);
		console.log("Output: " + JSON.stringify(Lispify.call(context, input1), null));

		console.log("=======================================================\n");
	})();

	(function interpretLambda() {

		console.log("\n\t INTERPRETING LAMBDA EXPRESSIONS \n");	

		var input1 = "(define circle-area (lambda (r) (* pi (* r r))))";
		var input2 = "(circle-area 3)";

		console.log("Define : " + input1);
		console.log("Procedure Call : " + input2);
		Lispify.call(context, input1);
		console.log("Output: " + Lispify.call(context, input2));

		console.log("=======================================================\n");

		var input3 = "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))";
		var input4 = "(fact 10)";
		var input5 = "(circle-area (fact 10))";

		console.log("Define : " + input3);
		console.log("Procedure Call : " + input4);
		Lispify.call(context, input3);
		console.log("Output: " + Lispify.call(context, input4));

		console.log("\nProcedure Call : " + input5);
		console.log("Output: " + Lispify.call(context, input5));	

		console.log("=======================================================\n");

		var input6 = "(define twice (lambda (x) (* 2 x)))";
		var input7 = "(twice 5)";

		console.log("Define : " + input6);
		console.log("Procedure Call : " + input7);
		Lispify.call(context, input6);	
		console.log("Output: " + Lispify.call(context, input7));

		console.log("=======================================================\n");

		var input6 = "(define twice (lambda (x) (* 2 x)))";
		var input8 = "(define repeat (lambda (f) (lambda (x) (f (f x)))))";
		var input9 = "((repeat twice) 10)";

		console.log("Define: " + input6)
		console.log("Define : " + input8);
		console.log("\nProcedure Call : " + input9);
		Lispify.call(context, input6);
		Lispify.call(context, input8);	
		console.log("Output: " + Lispify.call(context, input9));

		var input10 = "((repeat (repeat twice)) 10)";

		console.log("\nProcedure Call : " + input10);
		console.log("Output: " + Lispify.call(context, input10));	
	})();
}
