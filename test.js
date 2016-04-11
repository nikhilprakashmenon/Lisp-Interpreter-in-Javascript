var lispInterpreter = require('./Lispify');

var globalVar = lispInterpreter.globalVar;
var Parse     = lispInterpreter.Parse;
var Evaluate  = lispInterpreter.Evaluate;
var Lispify   = lispInterpreter.Lispify;

/*
==============================================================================================================
										 TESTS FOR PARSING LISP STATEMENTS
==============================================================================================================
*/

// expressionSyntaxCheck();
// specialFormCheck();
// peterNorvigIOCheck();
// programCheck();

/*
==============================================================================================================
										 TESTS FOR INTERPRETING LISP STATEMENTS
==============================================================================================================
*/

// EXPRESSIONS
// console.log(Parse("(* ( + 2 3) (/ 10 2))"));
// var ast = Parse("(* ( + 2 3) (/ 10 2))");
// console.log(Evaluate(ast));
// =============================================
// DEFINE FORM
// console.log(Parse("(define r 10)"));
// var ast = Parse("(define r 10)");
// console.log(Evaluate(ast));
// // console.log(global_env['r']);

// console.log(Parse("(* 3.14 (* r r))"));
// var ast = Parse("(* 3.14 (* r r))");
// console.log("result: " + Evaluate(ast));

// delete global_env['r'];
// =============================================
// IF FORM
// console.log(Parse("(if (= 10 10) (* 7 6) (+ 10 (/ 10 5)))"));
// var ast = Parse("(if (= 10 10) (* 7 6) (+ 10 (/ 10 5)))");
// console.log(Evaluate(ast));
// =============================================
// QUOTE
// console.log(Parse("(quote (+ 1 2))"));
// var ast = Parse("(quote (+ 1 2))");
// console.log(Evaluate(ast));
// =============================================
// LAMBDA FUNCTIONS
console.log(JSON.stringify(Parse('(define circle-area (lambda (r1 r2) (* pi (* r r))))'),null));
/*
==============================================================================================================
										 	  PARSING - TEST FUNCTIONS
==============================================================================================================
*/

function specialFormCheck(){
	

	callDefine();
	callIf();
	callQuote();
	callProcedure();

	function callDefine(){
		console.log("\nDefine Special Form\n\n")
		console.log("Program: " + "(define value 10)");
		console.log(Parse("(define value 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define twice (lambda (a b) (* a b)))");
		console.log(Parse("(define twice (lambda (a b) (* a b)))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define twice (lambda (a b) (* a (+ 1 2))))");
		console.log(Parse("(define twice (lambda (a b) (* a (+ 1 2))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (* 3 2))))");
		console.log(Parse("(define repeat (lambda (f) (lambda (x) (* 3 2))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (f (f x)))))");
		console.log(Parse("(define repeat (lambda (f) (lambda (x) (f (f x)))))"));

		
		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))");
		console.log(Parse("(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))");
		console.log(Parse("(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))"));
	}

	function callIf(){
		console.log("\nIf Special Form\n\n")
		console.log("Program: " + "(if (> id1 id2) (* 7 6) (+ 10 50))");
		console.log(Parse("(if (> id1 id2) (* 7 6) (+ 10 50))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(if (> (* 11 11) (+ a b)) (* 7 6) (+ 1 2))");
		console.log(Parse("(if (> (* 11 11) (+ a b)) (* 7 6) (+ 1 2))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(if (> (* 11 11) 120) (* 7 (/ 1 2)) (+ 1 2))");
		console.log(Parse("(if (> (* 11 11) 120) (* 7 (/ 1 2)) (+ 1 2))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n 10))))");
		console.log(Parse("(define fact (lambda (n) (if (<= n 1) 1 (* n 10))))"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "(define fact (lambda (n) (if (>= n (+ 1 1)) 1 (* n 10))))");
		console.log(Parse("(define fact (lambda (n) (if (>= n (+ 1 1)) 1 (* n 10))))"));
	}

	function callQuote(){
		console.log("\nQuote Special Form\n\n")
		console.log("Program: " + "(quote the)");
		console.log(Parse("(quote the)"));

		console.log("\n-----------------------------------------------\n");
	}

	function callProcedure(){
		console.log("\n Procedure Call\n\n")
		console.log("Program: " + "(pow 2 16)");
		console.log(Parse("(pow 2 16)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "((repeat twice) 10)");
		console.log(Parse("((repeat twice) 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "((repeat (repeat twice)) 10)");
		console.log(Parse("((repeat (repeat twice)) 10)"));

		console.log("\n-----------------------------------------------\n");

		console.log("Program: " + "((repeat (repeat (repeat twice))) 10)");
		console.log(Parse("((repeat (repeat (repeat twice))) 10)"));

		console.log("\n-----------------------------------------------\n");
	}
}

function expressionSyntaxCheck(){
	// Valid expressionSyntax
	console.log("Valid expressionSyntax\n");

	console.log("Program: " + "(* identifier1 10)");
	console.log(Parse("(* identifier1 10)"));

	console.log('----------------------------------------');

	console.log("Program: " + "(+ identifier1 ( / 3 2))");
	console.log(Parse("(+ identifier1 ( / 3 2))"));
	console.log('----------------------------------------');

	console.log("Program: " + "(+ identifier1 ( / 3 ( * id1 id2 )))");
	console.log(Parse("(+ identifier1 ( / 3 (* id1 id2 )))"));

	// Invalid expressionSyntax
	console.log("\n\n\nInvalid expressionSyntax\n");

	console.log("Program: " + "(* identifier1 10 10)");
	console.log(Parse("(* identifier1 10 10)"));

	console.log('----------------------------------------');
	console.log("Program: " + "(* identifier1 (/ / 2) 5)");
	console.log(Parse("(* identifier1 (/ / 2) 5)"));

	console.log('----------------------------------------');
	console.log("Program: " + "(* 10)");
	console.log(Parse("(* 10)"));

	//Invalid Identifiers
	console.log("\n\n\nInvalid Identifiers\n");

	console.log("Program: " + "(* identifier$ 10 10)");
	console.log(Parse("(* identifier$ 10 10)"));
}

function peterNorvigIOCheck(){

	console.log("\nInput Output - Peter Norvig\n\n")
	console.log("Program: " + "(define circle-area (lambda (r) (* pi (* r r))))");
	console.log(Parse("(define circle-area (lambda (r) (* pi (* r r))))"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(circle-area 3)");
	console.log(Parse("(circle-area 3)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))");
	console.log(Parse("(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))"));

	console.log("Program: " + "(fact 100)");
	console.log(Parse("(fact 100)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(circle-area (fact 10))");
	console.log(Parse("(circle-area (fact 10))"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(define twice (lambda (x) (* 2 x)))");
	console.log(Parse("(define twice (lambda (x) (* 2 x)))"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(define repeat (lambda (f) (lambda (x) (f (f x)))))");
	console.log(Parse("(define repeat (lambda (f) (lambda (x) (f (f x)))))"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "((repeat twice) 10)");
	console.log(Parse("((repeat twice) 10)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "((repeat (repeat (repeat twice))) 10)");
	console.log(Parse("((repeat (repeat (repeat twice))) 10)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(pow 2 16)");
	console.log(Parse("(pow 2 16)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))");
	console.log(Parse("(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(range 0 10)");
	console.log(Parse("(range 0 10)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(range 1 10)");
	console.log(Parse("(range 1 10)"));

	console.log("\n-----------------------------------------------\n");
}

function programCheck(){

	console.log("\n Complete Programs\n\n");

	console.log("Program: " + "(define circle-area 10)(circle-area 3)");
	console.log(Parse("(define circle-area 10)(circle-area 3)"));

	console.log("\n-----------------------------------------------\n");

	console.log("Program: " + "(define circle-area (lambda (r) (* pi (* r r))))(circle-area 3)");
	console.log(Parse("(define circle-area (lambda (r) (* pi (* r r))))(circle-area 3)"));

	console.log("\n-----------------------------------------------\n");

	// console.log("Program: " + "(circle-area 3)");
	// console.log(Parse("(circle-area 3)"));
}

/*
==============================================================================================================
										 INTERPRETING - TEST FUNCTIONS
==============================================================================================================
*/
