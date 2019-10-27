#include <string>
#include <vector>
#include <iostream>
#include <unordered_map>
#include <unordered_set>
#define TARGET_SYS GBC


vector<std::string> functions;
//vector<std::string> var_identifiers;
unordered_map<std::string, Var) var_identifiers;

//namespace mtn{}
enum FragType{
    FUNCTION_DECLARATION,
    FUNCTION_CALL,
    STRING, 
    INT,
    CHAR,
    ARRAY,
    OPERATOR, 
    VALUE,
    IDENTIFIER,
    RESERVED_KEYWORD,
    VARIABLE_TYPE
}

std::string symbols[] = {
    "{",
    "}",
    "[",
    "]",
    "(",
    ")"
}

enum operators{
    INC = "++",
    DEC = "--",
    ADD = "+",
    SUB = "-",
    DIV = "/",
    ASSIGN = "="
}


std::unordered_map<std::string, FragType> types({
    {"int", FragType::INT},
    {"char", FragType::CHAR},
    {"str", FragType::STRING},
    {"++", FragType::OPERATOR},
    {"--", FragType::OPERATOR},
    {"+", FragType::OPERATOR},
    {"-", FragType::OPERATOR},
    {"=", FragType::OPERATOR},
    {"{"},
    {"}"},
    {"("},
    {")"}
})

struct Collection{
    FragType type;
    std::vector<Statement> body;
}

struct Statement{
    FragType type;
    vector<Fragment> fragments;
}

/*
 *Fragments will be used to build the abstract tree of the program. Fragments are the smallest constituents
 *of a program
 */
struct Fragment{
    FragType type;
    std::string value;
}


vector<std::string> warnings;


/**
int parse(string body){
    vector<string> words;
    
    std::string line; 
    std::string tempword;
    
    getline(file, line);
    vector<Statement> statements;
    Statement tempStatement;
    
    for(int i = 0; i < line.length(); i++){
        if(line[i] == ";"){
            statements.push_back(tempStatement);
            break;
        }
        
        if(line[i] > 32 && line[i] < 126){
            tempword += line[i];
        }else{
            words.push_back(tempword);
            tempword = "";
        }
    }
    
    Statement s;
    
    for(int i = 0; i < words.size(); i++){
        Fragment tempFrag; 
        
        tempFrag.Type = FragType.find(words.get(0));
    }
}**/


int parse(std::string file_location){
    
    ifstream file(file_location);
    
    if(!file.is_open())
        return -1;
    
    vector<string> tokens;
    
    std::string line = "";
    getline(file, line);
    
    int cursor = 0;
    
    while(line !== file.eof()){
        int len = line.length();
        
        std::string tempToken;
        for(int i = 0; i < len; i++){
            if(line[i] == " "){
                if(line.length() !== 0){
                    tokens.push_back(line);
                    line = "";
                    continue;
                }
                continue;
            }
            
        }
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

std::unordered_set<std::string> reserved_keywords({
    "int8",
    "int16",
    "str",
    "bool",
    "byte",
    "void",
    "BASE",
    "LOAD",
    "ASM",
    "delete"
});


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

