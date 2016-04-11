# Lisp-Interpreter-in-Javascript
Version: 1.0

A lisp interpreter implemented in Javascript. 

Two step interpreter:-
  1. Tokenization and Parsing
  
```
    GRAMMAR (BNF - Backus Naur Form)
    -------------------------------
  
  	<LISPIFY> ::= "(" <E> ")"
  	<E> ::=  <EXPRESSION>
  			|<IF>
  			|<DEFINE>
  			|<QUOTE>
  			|<SET>
  			|<BEGIN>
  			|<PROCEDURE_CALL>
  
  	
  	<EXPRESSION> ::= < OP <EXPRESSION> <EXPRESSION> >
  					| "(" <EXPRESSION> ")"
  					| <NUMBER>
  					| <IDENTIFIER>
  	<OP> ::= "+" | "-" | "/" | "*"
  	<IDENTIFIER> ::= <ALPHABET> { <ALPHABET> | <DIGIT> | '-' | '_' }* 
  	<NUMBER> ::= <DIGIT> { <DIGIT> }*
  	<ALPHABET> ::= A | B | C ... | Z | a | b | ... | z
  	<DIGIT> ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  	
  
  	<IF> ::= "if" <TEST> <T> <T>
  	<TEST> ::= "(" <CONDOP> <EXPRESSION> <EXPRESSION> ")"
  	<CONDOP> ::= "<" | ">" | "<=" | ">=" | "="
  	<T> ::= <EXPRESSION> | <LAMBDACALL>
  	
  
  	<DEFINE> ::= "define" <IDENTIFIER> ( <LAMBDACALL> | "car" | "cdr" )
  	<LAMBDACALL> ::= "lambda" "(" <IDENTIFIER> { <IDENTIFIER> }* ")" "(" <T> | <IF> ")"
  				   | "(" <LAMBDACALL> ")"
  	
  
  	<SET> ::= 'set!' <IDENTIFIER> <T>
  	
  
  	<QUOTE> ::= "quote" <T>
  	
  
  	<BEGIN> ::= "begin" <LISPIFY> { <LISPIFY> }*
  	
  
  	<PROCEDURE_CALL> ::= <IDENTS> { <ARGUMENTS> }+	
  			           | "(" <PROCEDURE_CALL> ")"
  
  	<IDENTS> ::= <PROCEDURE_CALL> 
  		       |  <IDENTIFIER> 
  
  	<ARGUMENTS> ::= <PROCEDURE_CALL> 
  		          | <IDENTIFIER> 
  	              | <NUMBER>
```

  2. Evaluation


>To test: $ nodejs test.js

Reference: [How to Write a (Lisp) Interpreter (in Python)) - By Peter Norvig](http://norvig.com/lispy.html)
