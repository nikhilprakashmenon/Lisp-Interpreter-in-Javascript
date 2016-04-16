/*
==============================================================================================================
									   LISP-INTERPRETER-IN-JAVASCRIPT								   	  	   
==============================================================================================================
*/

var Lispy = (function(window, undefined) {
	
	var apis = {};

/*
==============================================================================================================
										   		PRIVATE SCOPE
==============================================================================================================
*/
	var _global_env = {
		'*': function(args) { return  args[0]  *  args[1] ; },
		'+': function(args) { return  args[0]  +  args[1] ; },
		'-': function(args) { return  args[0]  -  args[1] ; },
		'/': function(args) { return  args[0]  /  args[1] ; },
		'>': function(args) { return (args[0]  >  args[1]); }, 
		'<': function(args) { return (args[0]  <  args[1]); }, 
		'>=':function(args) { return (args[0] >=  args[1]); }, 
		'<=':function(args) { return (args[0] <=  args[1]); },
		'=': function(args) { return (args[0] === args[1]); },
		'pi': Math.PI,
	};

	//Error Handling function
	var _errorHandler = function(errorMessage){
		apis.globalVar.errorFlag = true;
		console.log("SyntaxError: " + errorMessage);
	}

	//Function for debugging purpose
	var _debuggy = function(string){
		if(apis.globalVar.debugFlag)
			console.log(string);
	}

/*
==============================================================================================================
										 	 	PUBLIC SCOPE
==============================================================================================================
*/

	// Global object for debugging and error handling 
	apis.globalVar = { debugFlag : false, errorFlag : false	};

	// Lisp Parser
	apis.Parse = function(input) {

		// Initializations 
		var index = -1;
		var parseTree = [];
		var programParseTree = [];
		var ch;
		apis.globalVar.errorFlag = false;

		
		// Function 'next' moves the pointer to the next non-space char
		ch = next();									
		while(true){		

			if(same('(' , ch)){
				// Primary function for checking the syntax and parsing the contents between ( )
				parseE();								
				ch = next();

				if(same(')' , ch) && !Lispy.globalVar.errorFlag){
					// Checking whether the input is a whole program
					ch = next();						
					if(ch != '('){
						if(programParseTree.length != 0) 
							programParseTree.push(parseTree);
						break;
					}	
					// Pushing the parsed expression to outer array
					programParseTree.push(parseTree);	
					// Re-initializing parseTree to empty array
					parseTree = [];						
					_debuggy("Successfully Parsed");
				}
				else{
					_errorHandler("Error Parsing. Missing ')' ");
					break;				
				}
			}
			else{
					_errorHandler("Error Parsing. Missing '(' ");
					break;	
			}
		}

		// returning the parsed Syntax tree (AST)
		return  (programParseTree === undefined || programParseTree.length == 0) ? parseTree : programParseTree;

		// Main Syntax Checker Function for Lispify
		function parseE(){								
			ch = next();		
			var type = operationSelector(ch);
			var currentOperation;

			// Second opening paranthesis denotes procedure call
			if(ch == '('){								
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
				
					//Decide the function to call
					var fnToCall = specialOperSelector(symbol);	

					//Setting currentOperation to the function to be called
					var matched = String(fnToCall).match(regexOperation).join();
					currentOperation = matched.substring(0,matched.length-1);
					
					// If its a procedure call
					if(currentOperation == "parseProcedure"){
						// Need to pass the symbol to parseProcedure	
						fnToCall(symbol);									
					}	
					else{
						// Pushing symbol into parse tree		 										
						parseTree.push(symbol);					
						//Calling the respective function
						fnToCall();								
					}			
					
				}
			}

			// Special Form Check - "define"
			function parseDefine(){								
				
				ch = next();
				// Valid identifier
				if(identifier = isIdentifier(ch)){				
					// Pushing identifier into parse tree
					parseTree.push(identifier);					
					ch = next();
					// If its a number
					if( number = isNumber(ch)){
						// Pushing number into parse tree
						parseTree.push(number); 				
					}
					// lambda
					else if( same('(' , ch) ){					 
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
									_errorHandler("Missing ')' within define body");
							}
						}
						else
							_errorHandler("SyntaxError: within 'define' body");
					}
				}
			}

			// Special Form Check - "if"
			function parseIf(){									
				ch = next();
				
				if(arguments.length == 0){

					// Checking the syntax of test condition
					var testParseResult = parseTestCondForIf(); 
					if(!Lispy.globalVar.errorFlag){
						// Pushing the parsed test condition to parse tree
						parseTree.push(testParseResult);		

						ch = next();
						parseTree.push(parseExpression());

						ch = next();
						parseTree.push(parseExpression());

					}
					else
						_errorHandler("Could not parse IF statement. Invalid testing condition");
				}
				// Has an array as argument - for lambda functions
				else if(arguments.length == 1){					
					var localTree = arguments[0];

					// Checking the syntax of test condition
					var testParseResult = parseTestCondForIf(); 

					if(!Lispy.globalVar.errorFlag){
						// Pushing the parsed test condition to parse tree
						localTree.push(testParseResult);		

						ch = next();
						localTree.push(parseExpression());

						ch = next();
						localTree.push(parseExpression());

						return localTree;
					}
				}
			}

			// Checking syntax of test condition for IF 
			function parseTestCondForIf(){									
																			
				var testTree = [];

				if(same('(' , ch)){
					// Checking test condition first followed by two expressions	
					ch = next();

					if(operationSelector(ch) == "condOperator"){			
						// Test Syntax - an operator followed by two expressions
						_debuggy("Conditional Operator: " + ch);
						
						//Pushing the conditional operator first
						testTree.push(ch); 									

						for(var i=1; i<=2;i++){
							//Incrementing pointer
							ch = next(); 									

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
							_errorHandler("Missing ) in test condition for IF statement");
					}
					else
						_errorHandler("Invalid test condition for If statement");
				}
				else
					_errorHandler("Missing ( in test condition for IF statement");
			}

			// Special Form Check - "Quote"
			function parseQuote(){
				ch = next();
				parseTree.push(parseExpression());									
			}

			// Parse Procedures
			function parseProcedure(symbol){
				parseTree = parseTree.concat(parseProcedureCall(symbol));
			}	

			function parseProcedureCall(symbol){
	    
				var procedureTree = [];
				
				// If the argument of the func is an expression
				if(operationSelector(ch) == "operator"){				
					procedureTree = procedureTree.concat(parseExpression());
				}

				if(typeof(symbol) === 'undefined'){
					_debuggy("parameter is undefined");
					//Calling fn to get the identifier part
					procedureTree = procedureTree.concat(parseProcIdentifier()); 
				}
				else{
					// Push the passed identifier into the local tree
					procedureTree.push(symbol);									
				}
				//Calling fn to get the arguments part	  
				procedureTree = procedureTree.concat(parseProcArgs());			
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
			      	 	_errorHandler("Missing ) within procedure call"); 
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
				        	_errorHandler("Missing ) within procedure call"); 			      
				    }
		
				    else if(number = isNumber(ch)){
				    	procArgTree.push(number);
				    }
					// IF the number is 0 - special case
				    else if(ch == "0"){										
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

			// Lambda Syntax Check
			function parseLambda(){											
				
				currentOperation = "parseLambda";
				
				//creating an empty list
				var tree=[];					

				// pushing lamnda keyword first
				tree.push("lambda");										
				return lambdaSyntax(tree);
			}

			// Lambda Syntax Check - Main body
			function lambdaSyntax(localTree){
				
				(function parametersCheck(){								
					// Function to check syntax of lambda parameters
					ch = next();
					if(same('(' , ch)){	
						var paramTree = [];
						var arg;
						ch = next();
						// repeat until we encounter closing bracket
						while(!(/\)/.test(ch))){										
				
							if(arg = isIdentifier(ch)){
								paramTree.push(arg);
							}
							else{
								_errorHandler("Invalid lambda arguments");
								break;
							}
							ch = next();
						}
						if(same(')', ch))
							localTree.push(paramTree);
						else
							_errorHandler("lambda - no closing bracket for parameters")
					}
					else
						_errorHandler("Invalid lambda parameters");

				})();

				if(!Lispy.globalVar.errorFlag){
					// If the lambda argument syntax is valid check the definition										
					_debuggy("Valid lambda parameters");

					ch = next();
					if(same('(' , ch)){
						ch = next();
						// expressionSyntax
						if(operationSelector(ch) == "operator"){				
							localTree.push(parseExpression());
						}
						else{													
							// If statement or lambda statement
							var symbol = symbolParser(ch);
							// if statement
							if(symbol == "if" || symbol == "IF"){				
								_debuggy("If special form - inside lambda");

								var tempIfTree = [];

								tempIfTree.push(symbol);
								localTree.push(parseIf(tempIfTree));
							}
							// Recursive lambda statement
							else if(symbol == "lambda" || symbol == "lambda"){	
								_debuggy("Recursive Lambda Call");

								var tempLambdaTree = parseLambda();
								localTree.push(tempLambdaTree);

							}
							// Function call							
							else{ 												
								_debuggy("function call inside lambda body");
								localTree.push(parseProcedureCall(symbol));
							}
						}
						ch = next();
						if(same(')' , ch)){
							return localTree;
						}
						else
							_errorHandler("Invalid Lambda Body Syntax. Missing Closing ')' bracket");
					}
					else
						_errorHandler("Invalid Lambda Body Syntax. Missing Open '(' bracket");
				}
				else
					return;

				return localTree;	
			}


			// Expression Syntax Check 
			function parseExpression(){			
	
				if(ch == '('){
					// An expression can also be enclosed within brackets
					ch = next();
					var parsedExp = parseExpression();
					//	if the expression syntax is valid
					if(!Lispy.globalVar.errorFlag){									
						ch = next();
						if(same(')' , ch))
							return parsedExp;
						else
							_errorHandler("Missing ) within expression syntax");
					}
				}
							
				else if(operationSelector(ch) == "operator" && !Lispy.globalVar.errorFlag){
					// An expression begins with an binary oper (+ , - , * , /)	
					var tree = [];
					// Pushing the operator first
					tree.push(ch);													 	
					// Checking Syntax for expression
					return expressionSyntax(tree); 										
				}
				// An expression can be a number
				else if(number = isNumber(ch)){											
					return number;
				}

				else if(ident = isIdentifier(ch)){
					// Procedure call if lambda fnc
					if(currentOperation == "parseLambda"){								
						return parseProcedureCall(ident);
					}
					// else return identifier
					else
						return ident;													
				}
				else{																	
					if(currentOperation == "parseLambda"){
						return null;
					}
					else
					_errorHandler("Error parsing Expression");
				}
			}

			// Expression Syntax Check - Main Body
			function expressionSyntax(localTree){									
				
				for(var i=1; i<=2; i++){
					
					ch = next();

					if(ch == '('){
						ch = next();
						// Recursive call of expressionSyntax
						var tempParseTree = parseExpression();					

						ch = next();
						if(same(')' , ch)){
							localTree.push(tempParseTree)
						}
						else
							_errorHandler("Missing )");					
					}

					//Number
					else if(num = isNumber(ch)){								
						localTree.push(num);
					}

					//Symbol or error
					else{														
						if(ident = isIdentifier(ch)){
							localTree.push(ident);
						}
						else
							break;
					}

				}
				return localTree;
			}

			// returns the function to be called
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
				}							
			};

			 // Checking whether an expr, lambda, procedure  
			function operationSelector(char){							    
																			 
				// To handle conditional operators  <= | >=
				index++;													
				var tempChar = char;
				tempChar += input.charAt(index);

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
				//lambda function
				if(/^lambda$/.test(char))										
					return "lambda";
				else if(/^[a-zA-Z]$/.test(char))								
					return "identifier";
			}

			//Checks whether the character is a number. Yes -> calls number parser and returns the whole number 
			//											No  -> return false
			function isNumber(char){
				if(!(isNaN(char))){
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
						_errorHandler("Invalid Identifier");
						return false;
					}
				}
				else
					return false;
			}
		}
		// Parses Symbols - identifiers/ keywords
		function symbolParser(currentCharacter){						
			var symbol = '';
			// Only identifies characters followeds by chars, _ , digits, -
			var regex = /^[a-zA-Z]+[_a-zA-Z0-9-]*$/g; 					
																		
			var currChar = currentCharacter;
			while(!(/[\s\)]/.test(currChar))){
				symbol += currChar;
				index++;			
				currChar = input.charAt(index);
			}
			index--;

			return (regex.test(symbol)) ? symbol : "invalidIdentifier";
		}
	 	// Number parser
		function numberParser(currentNumber){
			var number = '';
			var regex = /\./;
			var currNumber = currentNumber;
			while( !(/\s/g.test(currNumber)) 
				&& 
				( regex.test(currNumber) || !(isNaN(currNumber))) ){
				number += currNumber;
				index++;			
				currNumber = input.charAt(index);
			}
			index--;
			return parseFloat(number);						   
		}
	 	// Points to next non-whitespace character
		function next(){												
			index++;
			// Incrementing index first to point to next character
			var currChar = input.charAt(index);
			while(/\s/g.test(currChar)){
				index++;
				currChar = input.charAt(index);
			}
			return currChar;
		}

		//Function same checks whether two symbols are the equal
		function same(symbol, nextSymb){
			//debugger;
			if(symbol == nextSymb){
				return true;
			}
			else
				_errorHandler("Expected symbol: " + symbol + "  But Received: " + nextSymb);
		}
	}

	// Lisp Evaluator
	apis.Evaluate = function(currVal, env) {

		// Default - global scope set as current environment
		env = (typeof env !== 'undefined') ? env : _global_env;

		// Number literal
		if(typeof currVal === 'number') {
			return currVal;
		}

		// Variable reference 
		else if(typeof currVal === 'string') {
			return env[currVal];
		}

		// (define var exp)
		else if(currVal[0] === 'define') {
			// store the variable value mapping to the environment
			env[currVal[1]] = this.Evaluate(currVal[2], env);
		}

		// (if test conseq alternate)
		else if(currVal[0] === 'if') {
			return (this.Evaluate(currVal[1], env)) ? this.Evaluate(currVal[2], env) : this.Evaluate(currVal[3], env);
		} 
		// (quote exp)
		else if(currVal[0] === 'quote') {
			return currVal[1];
		}

		// (lambda (var..) exp)
		else if(currVal[0] === 'lambda') {
			// Create new local scope
			var new_local_env = Object.create(env);
			
			return function(args) { 
				var params = currVal[1]; 
				var body = currVal[2];	
				// new local scope
				var env = new_local_env;

				// Map params to args and update it in the local scope			
				try {
					if(args.length !== params.length)
						throw new Error("Expected " + params.length + " arguments but received " + arguments.length);	
					
					// Mapping formal arguments to actual arguments and updating it in the new local scope
					for(var i=0, j=0; i < args.length; i++, j++) 
						env[params[j]] = args[i];

					// Call Evaluate function with the new local scope
					return Lispy.Evaluate(body, env);

				}
				catch(e) {
					console.log(e.message);
				}
			};
		}

		// (proc args...)
		else { 
			var proc = this.Evaluate(currVal[0], env);
			var args = [];
			for (var i = 1; i < currVal.length; i++) {
				args.push(this.Evaluate(currVal[i], env));
			}
			return proc(args);
		}
	}

	//Lisp(Scheme) interpreter	
	apis.Lispify = function(program) {

		var ast = this.Parse(program);
		var output = this.Evaluate(ast);

		return output;
	}

	return apis;

})(this);

/*
==============================================================================================================
												MODULE EXPORT 
==============================================================================================================
*/

module.exports = {
	context: 	Lispy,
	globalVar:  Lispy.globalVar,
	Parse: 		Lispy.Parse,
	Evaluate:   Lispy.Evaluate,
	Lispify: 	Lispy.Lispify,
}