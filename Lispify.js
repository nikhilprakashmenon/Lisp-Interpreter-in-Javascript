/*
	AUTHOR : Nikhil Prakash
	PROGRAM : LISP (SCHEME) INTERPRETER
	VERSION : 1.0
	COMMENT : Interprets Expression Syntax
*/

var globalVar = {
	debugFlag : false,
};

//Error Handling function
function errorHandler(errorMessage){
	console.log("Invalid Syntax. Error: " + errorMessage);
};

//Function same checks whether two symbols are the equal
var same = function(symbol, nextSymb){
	//debugger;
	if(symbol == nextSymb){
		return true;
	}
	else{
		if(/\s/.test(nextSymb))
			errorHandler("Expected symbol: " + symbol + "  But Received: whitespace");
		else
			errorHandler("Expected symbol: " + symbol + "  But Received: " + nextSymb);
	}
};

//Function for debugging purpose
function debuggy(string){
	if(globalVar.debugFlag)
		console.log(string);
}

//Lisp(Scheme) interpreter
function Lispify(program){
	var index = -1;
	var parseTree = [];
	var ch;
	var errorFlag = false;

	ch = next();

	if(same('(' , ch)){
		parseE();
		ch = next();
		if(same(')' , ch) && !errorFlag)
			console.log("Successfully Parsed");
		else
			console.log("Error in Parsing");
	}

	// Function that checks syntax validity between '(' and ')'
	function parseE(){
		ch = next();		
		var type = operationSelector(ch);

		debuggy("Type: ");

		// An Expression
		if(type == "operator"){	
			parseTree = parseTree.concat(ExpSyntaxCheck());
		}

		// Expression Syntax Check 
		function ExpSyntaxCheck(){
			//debugger;
			if(operationSelector(ch) == "operator"){
				var tree = [];
				tree.push(ch); // Pushing the operator first
				debuggy("Calling expression function");
				return expression(tree); // Checking Syntax for expression
			}
			else{
				errorFlag= true;
				errorHandler("Expected Operator(+,-,/,*) but received "  + ch);
			}
		}

		// Expression Syntax Check - Main Body
		function expression(localTree){
			
			for(var i=1; i<=2; i++){
				//debugger;
				debuggy("Expression!!")
				ch = next();

				if(ch == '('){
					//pointing to next character
					ch = next();
					// Recursive call of expression
					var tempParseTree = ExpSyntaxCheck();

					ch = next();
					if(same(')' , ch)){
						localTree.push(tempParseTree)
						return localTree;
					}
					else{
						errorFlag= true;
						errorHandler("Missing )");														
					}
				}

				//Number
				else if(!(isNaN(ch))){
					//debugger;
					debuggy("Calling Number parser");
					var number = numberParser(ch);
					localTree.push(number);
				}

				//Symbol or error
				else{
					// Valid Symbol :- Begins with a character or underscore(_)
					if(/[a-zA-Z_]/g.test(ch)){
						debuggy("Calling Symbol parser");
						var symbol = symbolParser(ch);
						debuggy("Symbol: " + symbol);
						if(symbol != "invalidIdentifier")
							localTree.push(symbol);
						else{
							errorFlag= true;
							errorHandler("Invalid Identifier");
							break;
						}
					}
					else{
						errorFlag= true;
						errorHandler("Invalid Symbol: " + ch);
						break;
					}
				}

			}
			return localTree;
		}

	}

	// Function for parsing Symbols in Lisp program - returns valid symbol (Identifier/keyword)
	function symbolParser(currentCharacter){
		var symbol = '';
		var regex = /^[a-zA-Z]+[_a-zA-Z0-9]*$/g; // Only identifies characters followeds by chars, _ , digits
		var currChar = currentCharacter;
		while(!(/\s/g.test(currChar))){
			symbol += currChar;
			index++;			
			currChar = program.charAt(index);
		}
		index--;

		return (regex.test(symbol)) ? symbol : "invalidIdentifier";
	}

	// Function for parsing Number in Lisp program - returns valid Number 
	function numberParser(currentNumber){
		var number = '';
		var currNumber = currentNumber;
		while( !(/\s/g.test(currNumber)) && !(isNaN(currNumber)) ){
			number += currNumber;
			index++;			
			currNumber = program.charAt(index);
		}
		index--;

		return Number(number);
	}

	function next(){
		index++; // Incrementing index first to point to next character
		var currChar = program.charAt(index);
		while(/\s/g.test(currChar)){
			index++;
			currChar = program.charAt(index);
		}
		return currChar;
	}

	function operationSelector(char){
		debuggy("Testing: " + char);
		switch(char){
			case '*':
			case '/':
			case '+':
			case '-': return "operator";
		}
	}

	return parseTree;
}

function expressionCheck(){
	// Valid Expressions
	console.log("Valid Expressions\n");

	console.log("Program: " + "(* identifier1 10)");
	console.log(Lispify("(* identifier1 10)"));

	console.log('----------------------------------------');

	console.log("Program: " + "(+ identifier1 10 ( / 3 2))");
	console.log(Lispify("(+ identifier1 ( / 3 2))"));
	console.log('----------------------------------------');

	console.log("Program: " + "(+ identifier1 ( / 3 ( * id1 id2 )))");
	console.log(Lispify("(+ identifier1 ( / 3 (* id1 id2 )))"));

	// Invalid Expressions
	console.log("\n\n\nInvalid Expressions\n");

	console.log("Program: " + "(* identifier1 10 10)");
	console.log(Lispify("(* identifier1 10 10)"));

	console.log('----------------------------------------');
	console.log("Program: " + "(* identifier1 (/ / 2) 5)");
	console.log(Lispify("(* identifier1 (/ / 2) 5)"));

	console.log('----------------------------------------');
	console.log("Program: " + "(* 10)");
	console.log(Lispify("(* 10)"));

	//Invalid Identifiers
	console.log("\n\n\nInvalid Identifiers\n");

	console.log("Program: " + "(* identifier$ 10 10)");
	console.log(Lispify("(* identifier$ 10 10)"));
}

expressionCheck();
