#include <fstream>
#include <iostream>
#include <string>
#include <unordered_set>
#include <vector>

#define default_int_size "int8"
#define DEBUG false

struct Token{
    enum token_type{
        ENDL,
        FUNC_PARAM_START,
        FUNC_PARAM_END,
        FUNC_CALL,
        OPERATOR,
        OPERAND,
        UNKNOWN,
        VAR_NAME,
        VAR_TYPE
    };
    
    std::string value;
    token_type type;
    std::vector<Token> siblings;
    Token *parent;
    Token *child;
    
    Token(std::string val, token_type type) : value(val), type(type) {};
    Token(std::string val) : value(val), type(token_type::UNKNOWN) {};
    Token() : value(""), type(token_type::UNKNOWN) {};
    
    void set_child(Token *child){this->child = child;};
    void set_parent(Token *parent){this->parent = parent;};
    void add_sibling(Token sibling){siblings.push_back(sibling);};
};

std::unordered_set<std::string> var_types({"int","int8", "int16", "byte", "bool"});

std::vector<Token> parse(std::string file_location){
    
    std::ifstream file(file_location);
    
    //if(!file.is_open())
        //return -1;
    
    //std::vector<std::string> tokens;
    
    std::vector<Token> tokens;
    
    std::string line = "";
    getline(file, line);
    
    int currentToken = 0;
    bool complete = false;
    
    do{
        loop:
        int len = line.length();
        
        std::string tempToken = "";
        for(int i = 0; i < len; i++){
            
            std::cout << line[i];
            
            if(line[i] == ';'){
                tokens.push_back(Token(";", Token::token_type::ENDL));
                continue;
            }
            
            if(line[i] == ' ' || line[i] == ';'){
                if(line.length() != 0){
                    if(var_types.find(tempToken) != var_types.end()){
                        if(tempToken == "int")
                            tempToken == "int8";
                        
                        tokens.push_back(Token(tempToken, Token::token_type::VAR_TYPE));
                        currentToken++;
                    }
                    
                    if(tempToken == "+" || tempToken == "-" || tempToken == "/" || tempToken == "*" || tempToken == "++" || tempToken == "--"){
                        tokens.push_back(Token(tempToken, Token::token_type::OPERATOR));
                        currentToken++; 
                    }
                    
                    //tokens.push_back(tempToken);
                    
                    //if(line[i] = ';')
                    //    break;
                    
                    tempToken = "";
                    continue;
                }
                continue;
            }
            
            tempToken += line[i];
        }
        getline(file, line);
    }while(!file.eof());
    
    
    if(!complete){
        getline(file, line);
        complete = true;
        goto loop;
    }
    
    for(int i = 0; i < tokens.size(); i++){
        std::cout << tokens.at(i).value << std::endl;
    }
    
    file.close();
    
    return tokens;
}

/**
 * Contextualizes tokens from parsing into something that actually makes sense.
 * This is also where any errors are found.
 * */

int contextualize(std::vector<Token> &tokens){
    
    int current_line = 0;
    int len = tokens.size();
    for(int i = 0; i < len; i++){
        Token tempToken = tokens.at(i);
        
        if(tempToken.type == Token::token_type::ENDL){
            current_line++;
            continue;
        }
    }
}


int main(){
    
    std::vector<Token> tokens = parse("test.m");
    
    contextualize(tokens);
    
    
    return 0;
}