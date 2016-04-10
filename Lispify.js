/*
	AUTHOR : Nikhil Prakash
	PROGRAM : LISP (SCHEME) INTERPRETER
	VERSION : 1.0
	COMMENT : Parses the lisp program and produces syntax tree for basic functions


	GRAMMAR (BNF - Backus Naur Form)
	================================

	<LISPIFY> ::= "(" <E> ")"
	<E> ::=  <EXPRESSION>
			|<IF>
			|<DEFINE>
			|<QUOTE>
			|<SET>
			|<BEGIN>
			|<PROCEDURE_CALL>

	-------------------------------------------------------
	<EXPRESSION> ::= < OP <EXPRESSION> <EXPRESSION> >
					| "(" <EXPRESSION> ")"
					| <NUMBER>
					| <IDENTIFIER>
	<OP> ::= "+" | "-" | "/" | "*"
	<IDENTIFIER> ::= <ALPHABET> { <ALPHABET> | <DIGIT> | '-' | '_' }* 
	<NUMBER> ::= <DIGIT> { <DIGIT> }*
	<ALPHABET> ::= A | B | C ... | Z | a | b | ... | z
	<DIGIT> ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
	-------------------------------------------------------

	<IF> ::= "if" <TEST> <T> <T>
	<TEST> ::= "(" <CONDOP> <EXPRESSION> <EXPRESSION> ")"
	<CONDOP> ::= "<" | ">" | "<=" | ">=" | "="
	<T> ::= <EXPRESSION> | <LAMBDACALL>
	-------------------------------------------------------

	<DEFINE> ::= "define" <IDENTIFIER> ( <LAMBDACALL> | "car" | "cdr" )
	<LAMBDACALL> ::= "lambda" "(" <IDENTIFIER> { <IDENTIFIER> }* ")" "(" <T> | <IF> ")"
				   | "(" <LAMBDACALL> ")"
	-------------------------------------------------------

	<SET> ::= 'set!' <IDENTIFIER> <T>
	-------------------------------------------------------

	<QUOTE> ::= "quote" <T>
	-------------------------------------------------------

	<BEGIN> ::= "begin" <LISPIFY> { <LISPIFY> }*
	-------------------------------------------------------

	<PROCEDURE_CALL> ::= <IDENTS> { <ARGUMENTS> }+	
			           | "(" <PROCEDURE_CALL> ")"

	<IDENTS> ::= <PROCEDURE_CALL> 
		       |  <IDENTIFIER> 

	<ARGUMENTS> ::= <PROCEDURE_CALL> 
		          | <IDENTIFIER> 
	              | <NUMBER>

	-------------------------------------------------------
*/

// global object for debugging and error handling
var globalVar = {
	debugFlag : false,
	errorFlag : false,
};

//Error Handling function
function errorHandler(errorMessage){
	globalVar.errorFlag = true;
	console.log("Invalid Syntax. Error: " + errorMessage);
};

//Function same checks whether two symbols are the equal
var same = function(symbol, nextSymb){
	//debugger;
	if(symbol == nextSymb){
		return true;
	}
	else
		errorHandler("Expected symbol: " + symbol + "  But Received: " + nextSymb);
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
	var programParseTree = [];
	var ch;
	globalVar.errorFlag = false;

	ch = next();									// function 'next' moves the pointer to the next non-space char
	while(true){		

		if(same('(' , ch)){
			parseE();								// Primary function for checking the syntax and parsing the 
													// contents between ( )
			ch = next();

			if(same(')' , ch) && !globalVar.errorFlag){
				
				ch = next();						// Checking whether the input is a whole program
				if(ch != '('){
					if(programParseTree.length != 0) 
						programParseTree.push(parseTree);
					break;
				}	
				programParseTree.push(parseTree);	// Pushing the parsed expression to outer array
				parseTree = [];						// Re-initializing parseTree to empty array
				debuggy("Successfully Parsed");
			}
			else{
				errorHandler("Error Parsing. Missing ')' ");
				break;				
			}
		}
		else{
				errorHandler("Error Parsing. Missing '(' ");
				break;	
		}
	}

													// returning the parsed Syntax tree (AST)
	return  (programParseTree === undefined || programParseTree.length == 0) ? parseTree : programParseTree;

	
	function parseE(){								// Main Syntax Checker Function for Lispify
		ch = next();		
		var type = operationSelector(ch);
		var currentOperation;


		if(ch == '('){								// Second opening paranthesis denotes procedure call
			parseProcedure();
		}
													// An expressionSyntax
		else if(type == "operator"){	
			currentOperation = "expression";
			parseTree = parseTree.concat(parseExpression());
		}
													// A Function Call or a Special Form expressionSyntax
		else if(type == "identifier"){

			if(symbol = isIdentifier(ch)){

				var regexOperation = /parse.*\(/;
			
				
				var fnToCall = specialOperSelector(symbol);	//Decide the function to call

															//Setting currentOperation to the function to be called
				var matched = String(fnToCall).match(regexOperation).join();
				currentOperation = matched.substring(0,matched.length-1);

				if(currentOperation == "parseProcedure"){	// If its a procedure call
					fnToCall(symbol);						// Need to pass the symbol to parseProcedure			
				}	
				else{										// Otherwise
					parseTree.push(symbol);					// Pushing symbol into parse tree		 
					fnToCall();								//Calling the respective function
				}			
				
			}
		}

		
		function parseDefine(){								// Special Form Check - "define"
			debuggy("parse define special form");

			ch = next();

			if(identifier = isIdentifier(ch)){				// Valid identifier

				parseTree.push(identifier);					// Pushing identifier into parse tree
				ch = next();
				if( number = isNumber(ch)){					// If its a number
					parseTree.push(number); 				// Pushing number into parse tree
				}
				else if( same('(' , ch) ){					// lambda 
					ch = next();

					if(ident = isIdentifier(ch)){
						if(operationSelector(ident) == "lambda"){
							currentOperation = "parseLambda";
							var lambdaTree = [];
							lambdaTree.push(parseLambda());
							parseTree = parseTree.concat(lambdaTree);

							ch = next();
							if(same(')' , ch))
								return;
							else
								errorHandler("Missing ')' within define body");
						}
					}
					else
						errorHandler("Invalid 'define' body syntax");
				}
			}
		}


		
		function parseIf(){									// Special Form Check - "if"
			debuggy("parse If special form");
			ch = next();
			
			if(arguments.length == 0){
				
				var testParseResult = parseTestCondForIf(); // Checking the syntax of test condition
				if(!globalVar.errorFlag){
					parseTree.push(testParseResult);		// Pushing the parsed test condition to parse tree

					ch = next();
					parseTree.push(parseExpression());

					ch = next();
					parseTree.push(parseExpression());

				}
				else
					errorHandler("Could not parse IF statement. Invalid testing condition");
			}
			else if(arguments.length == 1){					// Has an array as argument - for lambda functions
				var localTree = arguments[0];

				
				var testParseResult = parseTestCondForIf(); // Checking the syntax of test condition

				if(!globalVar.errorFlag){
					localTree.push(testParseResult);		// Pushing the parsed test condition to parse tree

					ch = next();
					localTree.push(parseExpression());

					ch = next();
					localTree.push(parseExpression());

					return localTree;
				}
			}
		}

		
		function parseTestCondForIf(){									// Checking syntax of test condition for IF 
																		
			debuggy("Checking syntax of test for IF Special form");

			var testTree = [];

			if(same('(' , ch)){											// Checking test condition first followed by 
																		//two expressions
				ch = next();

				if(operationSelector(ch) == "condOperator"){			// Test Syntax - an operator followed by 
																		//two expressions
					
					debuggy("Conditional Operator: " + ch);

					testTree.push(ch); 									//Pushing the conditional operator first

					for(var i=1; i<=2;i++){
					
						ch = next(); 									//Incrementing pointer

						if(num = isNumber(ch))
							testTree.push(num);
						
						else if(str = isIdentifier(ch))
							testTree.push(str);

						else
							testTree.push(parseExpression());
					}

					ch = next();

					if(same(')' , ch))
						return testTree;
					else
						errorHandler("Missing ) in test condition for IF statement");
				}
				else
					errorHandler("Invalid test condition for If statement");
			}
			else
				errorHandler("Missing ( in test condition for IF statement");
		}

		
		function parseQuote(){
			debuggy("parse quote special form");

			ch = next();
			parseTree.push(parseExpression());									// Special Form Check - "Quote"
		}

		
		function parseSet(){									  // Special Form Check - "set!"
			debuggy("parse set special form");
		}

		
		function parseBegin(){									 // Special Form Check - "begine"
			debuggy("parse begin special form");
		}

		function parseProcedure(symbol){
			parseTree = parseTree.concat(parseProcedureCall(symbol));
		}	

		function parseProcedureCall(symbol){
    
			var procedureTree = [];

			if(operationSelector(ch) == "operator"){				// If the argument of the func is an expression
				procedureTree = procedureTree.concat(parseExpression());
			}

			if(typeof(symbol) === 'undefined'){
				debuggy("parameter is undefined");
				procedureTree = procedureTree.concat(parseProcIdentifier()); //Calling fn to get the identifier part
			}
			else{
				debuggy("parameter is: " + symbol);
				procedureTree.push(symbol);									// Push the passed identifier into the local tree
			}
			 
			procedureTree = procedureTree.concat(parseProcArgs());			//Calling fn to get the arguments part	  
			return procedureTree;
		}

		function parseProcIdentifier(){
		  		  
		    var procIdentTree = [];

		   	if(ch =='('){
		     	ch = next();
		     	var tempIdentifier = parseProcedureCall();
		     	ch = next();
		     	if(same(')', ch))
		     		procIdentTree.push(tempIdentifier);
		    	else
		      	 	errorHandler("Missing ) within procedure call"); 
	   		}
	   		
		    if(ident = isIdentifier(ch))
	    		procIdentTree.push(ident);		    
		     
		    return procIdentTree;		  
		}

		function parseProcArgs(){
		  
		  	var procArgTree = [];		  
		  	ch = next();

		  	
			while(!(/\)/.test(ch))){
				if(ch == '('){
			      
			    	ch = next();
			    	var tempArgs = parseProcedureCall();
			    	ch = next();
			    	if(same(')', ch)){
			        	procArgTree.push(tempArgs);
			    	}
			      	else
			        	errorHandler("Missing ) within procedure call"); 			      
			    }
	
			    else if(number = isNumber(ch)){
			    	procArgTree.push(number);
			    }

			    else if(ch == "0"){										// IF the number is 0 - special case
			    	procArgTree.push(0);
			    }

			    else if(ident = isIdentifier(ch) || ch == "0"){
			    	procArgTree.push(ident);
			    }
			    ch = next();
			}
		 	index--;
		  
		    return procArgTree;
		}

			
		function parseLambda(){											// Lambda Syntax Check
			
			debuggy("Inside Lambda function");
			currentOperation = "parseLambda";

			var tree=[];												//creating an empty list
			tree.push("lambda");										// pushing lamnda keyword first
			return lambdaSyntax(tree);
		}

		
		function lambdaSyntax(localTree){								// Lambda Syntax Check - Main body

			
			(function parametersCheck(){								// Function to check syntax of 
																		//lambda parameters

				ch = next();
				if(same('(' , ch)){	
					var paramTree = [];
					var arg;
					ch = next();
					while(!(/\)/.test(ch))){							// repeat until we encounter closing bracket
			
						if(arg = isIdentifier(ch)){
							paramTree.push(arg);
						}
						else{
							errorHandler("Invalid lambda arguments");
							break;
						}
						ch = next();
					}
					if(same(')', ch))
						localTree.push(paramTree);
					else
						errorHandler("lambda - no closing bracket for parameters")
				}
				else
					errorHandler("Invalid lambda parameters");

			})();

			if(!globalVar.errorFlag){										// If the lambda argument syntax is 
																			//valid check the definition
				debuggy("Valid lambda parameters");

				ch = next();
				if(same('(' , ch)){
					ch = next();
					if(operationSelector(ch) == "operator"){				// expressionSyntax
						localTree.push(parseExpression());
					}
					else{													// If statement or lambda statement
						var symbol = symbolParser(ch);
						if(symbol == "if" || symbol == "IF"){				// if statement
							debuggy("If special form - inside lambda");

							var tempIfTree = [];

							tempIfTree.push(symbol);
							localTree.push(parseIf(tempIfTree));
						}
						else if(symbol == "lambda" || symbol == "lambda"){	// Recursive lambda statement
							debuggy("Recursive Lambda Call");

							var tempLambdaTree = parseLambda();
							localTree.push(tempLambdaTree);

						}
						else{ 												// Function call							
							debuggy("function call inside lambda body");
							localTree.push(parseProcedureCall(symbol));
						}
					}
					ch = next();
					if(same(')' , ch)){
						return localTree;
					}
					else
						errorHandler("Invalid Lambda Body Syntax. Missing Closing ')' bracket");
				}
				else
					errorHandler("Invalid Lambda Body Syntax. Missing Open '(' bracket");
			}
			else
				return;

			return localTree;	
		}


		
		function parseExpression(){											// Expression Syntax Check 
			
			
			if(ch == '('){													// An expression can also be enclosed 
																			//within brackets
				ch = next();
				var parsedExp = parseExpression();
				if(!globalVar.errorFlag){									//	if the expression syntax is valid
					ch = next();
					if(same(')' , ch))
						return parsedExp;
					else
						errorHandler("Missing ) within expression syntax");
				}
			}
						
			else if(operationSelector(ch) == "operator" && !globalVar.errorFlag){	// An expression begins with 
																				 	//an binary oper (+ , - , * , /)
				var tree = [];
				tree.push(ch);													 	// Pushing the operator first
				return expressionSyntax(tree); 										// Checking Syntax for expression
			}
			
			else if(number = isNumber(ch)){											// An expression can be a number
				return number;
			}

			else if(ident = isIdentifier(ch)){
				
				if(currentOperation == "parseLambda"){								// Procedure call if lambda fnc
					return parseProcedureCall(ident);
				}
				else
					return ident;													// else return identifier
			}
			
			else{																	// Error parsing
				if(currentOperation == "parseLambda"){
					return null;
				}
				else
				errorHandler("Error parsing Expression");
			}
		}

		
		function expressionSyntax(localTree){									// Expression Syntax Check - Main Body
			
			for(var i=1; i<=2; i++){
				
				debuggy("expressionSyntax!!")
				ch = next();

				if(ch == '('){
					ch = next();
					
					var tempParseTree = parseExpression();					// Recursive call of expressionSyntax

					ch = next();
					if(same(')' , ch)){
						localTree.push(tempParseTree)
					}
					else
						errorHandler("Missing )");					
				}

				
				else if(num = isNumber(ch)){								//Number
					localTree.push(num);
				}

				
				else{														//Symbol or error

					if(ident = isIdentifier(ch)){
						localTree.push(ident);
					}
					else
						break;
				}

			}
			return localTree;
		}

	
		
		function specialOperSelector(string){
			switch(string){
				case "if":
				case "IF":return parseIf;
				case "quote":
				case "QUOTE":return parseQuote;
				case "define":
				case "DEFINE":return parseDefine;
				case "set":
				case "SET":return parseSet;
				case "begin":
				case "BEGIN":return parseBegin;
				default: return parseProcedure;
			}							// returns the function to be called
		};

		
		function operationSelector(char){							     // Checking whether an expr, lambda, procedure  
																		 
			debuggy("Testing: " + char);

			index++;													// To handle conditional operators  <= | >=
			var tempChar = char;
			tempChar += program.charAt(index);

			switch(tempChar){
				case '<=':
				case '>=':  ch = tempChar;
							return "condOperator";
				default: index--; 
						 break;
			}
			
			switch(char){
				case '*':
				case '/':
				case '+':
				case '-': return "operator";
				case '<':
				case '>':
				case '=':return "condOperator";
				default: break;
			}

			if(/^lambda$/.test(char))										//lambda function
				return "lambda";
			else if(/^[a-zA-Z]$/.test(char))								//Everything else
				return "identifier";
		}

		//Checks whether the character is a number. Yes -> calls number parser and returns the whole number 
		//											No  -> return false
		function isNumber(char){
			if(!(isNaN(char))){
				debuggy("Calling Number parser");
				var number = numberParser(ch);
				return number;
			}
			else
				return false;
		}

		//Checks whether the character is a string. Yes -> calls symbol parser and returns the whole identifier
		//											No  -> return false
		function isIdentifier(char){
			if(/[a-zA-Z_]/g.test(char)){

				var symbol = symbolParser(ch);
				if(symbol != "invalidIdentifier")
					return symbol;
				else{
					errorHandler("Invalid Identifier");
					return false;
				}
			}
			else
				return false;
		}
	}

	function symbolParser(currentCharacter){						// Parses Symbols - identifiers/ keywords
		var symbol = '';
		var regex = /^[a-zA-Z]+[_a-zA-Z0-9-]*$/g; 					// Only identifies characters followeds by 
																	// chars, _ , digits, -
		var currChar = currentCharacter;
		while(!(/[\s\)]/.test(currChar))){
			symbol += currChar;
			index++;			
			currChar = program.charAt(index);
		}
		index--;

		return (regex.test(symbol)) ? symbol : "invalidIdentifier";
	}
 
	function numberParser(currentNumber){
		var number = '';
		var currNumber = currentNumber;
		while( !(/\s/g.test(currNumber)) && !(isNaN(currNumber)) ){
			number += currNumber;
			index++;			
			currNumber = program.charAt(index);
		}
		index--;

		return Number(number);						   // Number parser
	}

	function next(){												 // Points to next non-whitespace character
		index++;													 // Incrementing index first to point to next 
																	 //character
		var currChar = program.charAt(index);
		while(/\s/g.test(currChar)){
			index++;
			currChar = program.charAt(index);
		}
		return currChar;
	}
}

/*
==============================================================================================================
										MODULE EXPORT FOR TEST FILE 
==============================================================================================================

*/

module.exports = {
	globalVar: globalVar,
	Lispify: Lispify
}
