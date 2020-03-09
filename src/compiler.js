const fs = require("fs");

var file;

//base var types provided by the compiler (custom types not supported currently)
const VALID_VAR_TYPE = [
    'bool',     //boolean, stored as an array (not required though, but it saves space)
    'int8',     //1 byte integer
    'int16',    //2 byte integer
    'str',      //string array based off char; might be heavy on memory 
    'byte',     //1 byte, can be used for anything
    'ptr'       //pointer to a memory address
    ];
    

//ignore these for now. Compiler hasn't developed far enough to know what I'll use this for    
const INTERNAL_FUNCTIONS = [
    'BASE',
    'INIT',
    'MAIN',
    'PUSH'
];


//variables types generated by the user
const USER_GEN_TYPES = [];

//Reserved variable identifiers that are not allowed to be used (CPU registers)
const RESERVED_IDENTIFIERS = [
    '$A',   // 'A'  register (Accumulator)
    '$B',   // 'B'  register (1 byte)
    '$C',   // 'C'  register (1 byte)
    '$D',   // 'D'  register (1 byte)
    '$E',   // 'E'  register (1 byte)
    '$F',   // 'F'  register (1 byte)
    '$BC',  // 'BC' register (2 bytes)
    '$DE',  // 'DE' register (2 bytes)
    '$HL',  // 'HL' register (2 bytes)
    '$PC',  // Program counter register
    '$SP'   // Stack pointer register
    ];
    
    
//symbols used for various reasons
const RESERVED_SYMBOLS = [
    '$',    //will probably come to be an internal var specifier once the compiler comes closer to maturity
    '@',    //same here
    ',',    //used as a seperator 
    '(',    //function call, begin parenthesis for ordering 
    ')',    //end function call, end parenthesis for ordering
    '{',    //statement or grouping, might be used for other things in the future
    '}',    //statement or grouping, might be used for other things in the future
    '[',    //array index; possible change in meaning 
    ']',    //array index; ditto
    '.'     //multiuse tool, for now.
    ]

//keywords reserved for use in program logic/function
const RESERVED_KEYWORDS = [
    'asm',  //assembly or assembly functions
    'none', //basically undefined or null
    'func', //functions
    'if',   //if statement
    'elif', //else if statement
    'else', //else statement
    'for',  //for loop 
    'ret',  //return value from function
    'void', //return type void, just to avoid confusion with none
    'while' //while loop
    ];
    
const RESERVED_OPERATORS = [
    '"',    //string literal
    '=',    //assignment operator
    '++',   //increment by 1
    '--',   //decrement by 1
    '==',   //equality operator (bitwise)
    '+',    //addition operator
    '-',    //subraction operator 
    '/',    //division operator (might not be implemented on GBC platform)
    '*',    //multiplication operator (might not be implemented on GBC platform)
    '+=',   //increment and then assign value to variable
    '-=',   //decrement and then assign value to variable
    '!=',   //left-hand value is not equal to right hand value
    '>',    //greater than
    '<',    //less than
    '!',    //negate boolean, but not store
    '!!',   //negate and set boolean
    '=>',   //usage unknown atm, but could be used for something interesting
    '<=',   //ditto
    '.',    //ditto
    '$',    //ditto
    '::',   //ditto
    ':;',   //ditto
    ':',    //ditto
    '?'     //ditto
    ];
    
var USER_IDENTIFIERS = [];  //Array that stores user created variable identifiers

var token_list = [];    //individual tokens parsed from the program file


var message_list = {    //populated with messages generated during the compilation process
    errors: [],
    info: [],
    warnings: []
}


function token(){
    this.type;
    this.name;
    this.value;
    this.children = [];
}


//Determines the type of the token based on predefined token types
function type(object){
    
    if(object >= '0' && object <= '9'){
        return "NUMBER_LITERAL";
    }
    
    for(let item of RESERVED_SYMBOLS){
        if(item == object)
            return "RESERVED_SYMBOL";
    }
    
    for(let item of RESERVED_OPERATORS){
        if(item == object)
            return "RESERVED_OPERATOR";
    }
    
    for(let item of VALID_VAR_TYPE){
        if(item == object)
            return "VAR_TYPE";
    }
    
    for(let item of RESERVED_KEYWORDS){
        if(item == object)
            return "KEYWORD";
    }
    
    for(let item of RESERVED_IDENTIFIERS){
        if(item == object)
            return "INTERNAL_VAR";
    }
    
    //Token type is unknown. It might be a user variable or an actual error in code
    return "UNKNOWN/ERROR";
}

/**
 * Function reads from the file provided. Currently, multi-file programs
 * won't be able to run on this compiler until the compiler reaches a decent
 * level of completion. The function then proceeds to split the file based on
 * spaces in the text. It's ignorant of semicolons, parenthesis, and any other
 * sort of programming logic/symbols.
 **/
fs.readFile("main.m", 'utf-8', (err, data)=>{
    
    if(err)
        console.log("An Error has occurred. Does the file exist?");
        
    file = data.replace(/\n/g, ' NEW_LINE ');
    
    let current_token = "";
    
    for(let i = 0; i < file.length; i++){
        if(file[i] == '"'){
            current_token += file[i];
            
            for(let j = i + 1; j < file.length; j++){
                if(file[j] == '"'){
                    current_token += '"';
                    token_list.push(current_token);
                    current_token = "";
                    i = j;
                    break;
                }else{
                    current_token += file[j];
                }
            }
            continue;
        }
        if(file[i] !== ' '){
            current_token += file[i]; 
        }else{
            if(current_token.length > 0){
                token_list.push(current_token);
                current_token = "";
            }
        }
    }
    token_list.push(current_token);
    
    contextualize(clean_up());
});



/**
 * Function cleans up any dirty tokens that the parser would have lazily parsed.
 * It gives each token a line # and a type as well as a value.
 * */
function clean_up(){
    let updated_list = [];          //cleaned up token list
    
    let current_line = 0;               //current line token is on
    let c_line_comment = false;         //set to true when comment is active on line
    let c_string_literal = false;       //true whenever a string literal is actively being read
    let double_quotes_active = false    //true whenever string literal was started by double quotes
    let single_quotes_active = false    //true whenever string literal was started by single quotes
    
    let persistent_token;               //persistent token that persists between loops (used mainly for string literals)
    
    
    //goes through each token in the dirty token list
    for(var i = 0; i < token_list.length; i++){
        
        var token = token_list[i];  //picking out token from token list
        
        if(token == "NEW_LINE"){
            c_line_comment = false; //single line comment ends on new line
            current_line++;         //parsing now moves onto new line
            continue;               //NEW_LINE not added to token list
        }
        
        if(c_line_comment)          //if a comment is active, skip the token
            continue;
        
        var new_token = {
            type: undefined,        //Type of token goes here
            value: "",              //pretty much the identifier of the token
            line: current_line,     //line where token is found
            children: []            //tokens that are associated with this token
        };
        
        //going through each character in token 
        for(var j = 0; j < token.length; j++){
            
            let token_char = token[j];
            
            
            if(token.length - j > 2 && token_char == '/' && token[j + 1] == '/'){
                c_line_comment = true;//the rest of the line is assumed to be a comment
                break;
            }
            
            //if token is non alphanumerical (usually for programming logic), they are separated into a new token
            if(token_char == '{' || token_char == '}' || token_char == '(' || token_char == ')' || token_char == '[' || token_char == ']'){
                
                updated_list.push(new_token); //current working token is pushed onto new token list
                
                //new token object for the single token 
                new_token = {
                    type: undefined,
                    value: token[j],
                    line: current_line
                };

                updated_list.push(new_token);  //current symbol is pushed onto token list "{,}, (, )"
                
                new_token = {
                    type: undefined,
                    value: "",
                    line: current_line
                };               // new token is started
                continue;
            }
            
            //if current statement hasn't ended, push token character onto clean token string
            if(token[j] !== ';'){
                new_token.value += token[j];
            }else{
                break;
            }
        }
        
        if(new_token.value.length > 0 || new_token.value != undefined)
            updated_list.push(new_token);
    }
    
    return updated_list;
}


/**
 * Function will add more properties to the token and give it context
 * within the program. Things such as token type, identifiers, and values
 * for the token will be added. This is basically the AST generator for thes
 * entire program.
 **/
function contextualize(token_array){
    let new_arr = [];       //quick hack until I figure out why tokens with undefined values are still
                            //being pushed onto my token_array

    //gives each token a type
    for(var i = 0; i < token_array.length; i++){
        let token = token_array[i];             //grabs a token from token_array
        
        if(token.value[0] == '"'){
            token.type = "STRING_LITERAL";
            new_arr.push(token);
            continue;
        }
        
        token.type = type(token.value);         //sets the token type based on its value
        
        if(token.value.length > 0)
            new_arr.push(token);
        
        //debug line
        /*
        if(token.type == "UNKNOWN/ERROR"){
             console.log(`Token: ${token.value} , Type: ${token.type} , Line: ${token.line}`);
        }*/
        
    }
    
    console.log(new_arr);
    
    
    return 1;
    /**
     * Recursive function probably works best for this scenario, especially since
     * i'm trying to create an AST, exhausting all possible choices would work 
     * efficiently. The worst problem is figuring out how complex to make it or how 
     * to account for complex situations. For now, only single statements are allowed,
     * plus it most accurately reflects ASM language. By keeping it close to ASM, but 
     * slightly abstracted, it'll likely prevent any long time processes from ocurring.
     * 
     * if(token.type == variable type)
     *      expect next token to be an identifier
     *      if not, continue searching until new line
     *      if new line reached and no identifier found, add error to list
     *          break out of compilation and display errors (or maybe continue)
     *      
     *      if identifier found, 
     *          add identifier as a child to the variable type, or maybe just feed it 
     *          and add another property to the object
     * 
     *          continue reading the line
     *          if encounter an operator
     *              check if operator is valid for use
     *          
     * */
}


//recursive function... to be implemented
function read_down_tree(token, token_list){
    
    
    
    
    
    
    /**
        for(let token of token_array){
        if(!working_on_statement){
            //if a var type is read in, expect an identifier to come next
            if(token.type == "VAR_TYPE"){
                working_on_statement = true;    //working flag is set to true
                current_working_token = token   //work will now be done on the var identifier token
            }
        }else{
            
        }
    }
    
    for(let token of token_array){
        if(!working_on_statement){
            if(token.type == "VAR_TYPE"){
                working_on_statement = true;
                current_working_token = token;
            }
        }else{
            if(token == "UNKNOWN/ERROR" && current_working_token == "VAR_TYPE"){
                USER_IDENTIFIERS.push(token.value);
            }
        }
    }
    
    let end = false;
    if(!end)
        read_down_tree("hello", 3);
    else
        return "yes";
        
        **/
}

function valid_identifier(identifier){
    
    if(identifier[0] == '$')
        message_list.warnings.push(`${identifier}`);
    
    let valid = /^[A-Za-z]+$/;
    return valid.test(valid);
}