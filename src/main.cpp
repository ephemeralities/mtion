#include <string>
#include <vector>
#include <iostream>
#include <unordered_map>
#define TARGET_SYS GBC


vector<std::string> functions;
//vector<std::string> var_identifiers;
unordered_map<std::string, Var) var_identifiers; 

vector<std::string> warnings;

void parse(string body){
    vector<string> words;
    
    for(each word in body string){
        words.push_back(word(string, TYPE));
    }
    
    if(var_identifiers.find(VAR_TO_COMPARE) == var_identifiers.end()){
        warnings.push_back
    }
        
    
    
}

void displayMessages(){
    int len = warnings.length();
    for(int i = 0; i < len; i++){
        std::cout << warnings[i] << std::endl;
    }
}

int main(){
    return 0;
}

//Reserved keywords for the language
std::string reserved_keywords[] = {
    "int8",
    "int16",
    "str",
    "bool",
    "byte",
    "void",
    "BASE",
    "LOAD",
    "ASM"
}

enum operators{
    INC = "++",
    DEC = "--",
    ADD = "+",
    SUB = "-",
    DIV = "/",
    ASSIGN = "="
}

//enum reserved_words

//Variables available to the compiler. Custom types may not be possible (target: GBC)
enum default_var_type{
    INT,
    STRING,
    BYTE,
    FLOAT,
    DOUBLE,
    BOOLEAN
}

//Types of words available when reading the file
public enum word_type{
    OPERATOR,
    ACCESS_SPECIFIER,
    VARIABLE,
    VARIABLE_TYPE_SPECIFIER,
    GROUPING_STRUCTURE
}

//Message types (used when compiling)
public enum message_type{
    ERROR,
    WARNING,
    INFO
}


public struct Var{
    std::string identifier;
    std:string value;
    word_type var_type;
    
    var(std::string, std::string, word_type);
    var(std::string, word_type);
}

Var::var(std::string name, std::string, word_type type) : identifier(name), value(value), var_type(type){}

//Provides a default value to the uninstantiated variable
Var::var(std::string name, word_type type){
    identifier = name;
    
    switch(type){
        case default_var_type::INT :
            value = "0";
        case default_var_type::BOOLEAN :
            value = "FALSE";
    }
}

//Struct for messages that will be printed to console
public struct Message{
    message_type type;
    std::string content;
    
    message(message_type type, std::string content) : type(type), content(content){};
}

//words will be used to build the abstract tree of the program. Words are the smallest item possible
//in the program
public struct word{
    word_type type;
    std::string content;
    word(word_type type, std::string content) : type(type), content(content){};
}