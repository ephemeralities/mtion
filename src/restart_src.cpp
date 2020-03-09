#include <iostream> //used for file accessing
#include <vector> //Used for, you guessed it, vectors




/**
 * Parses through document (in this case, GBC lang), and separates it into tokens.)
 * Error checking is not completed in this stage, so any output should not be 
 * trusted.
 **/
vector<std::string> parse(std::string file_URI){
    ifstream file(file_URI)
    
    //if file cannot be opened, or does not exist, throw an error
    if(!file.is_open())
        return -1; //subject to change
        
    vector<std::string> tokens;
    std::string current_line = "";
    
    getline(file)

    return tokens;
}

/**
 * Contextualizes tokens within the program and gives them definite meaning
 * (value, identifier, token type, etc). Error checking is also done at this
 * stage regarding placement of tokens and whether tokens fall within rules 
 * defined by specification.
 **/
int contextualize(vector<std::string>& tokens){
    
    vector<defined_token> completed_tokens;
    vector<std::string> errors;
    
    for(std::string : tokens){
        
    }
    
    
    //for now, if any errors are found, they'll be printed to the console
    if(errors.size() > 0){
        for(std::string error : errors){
            std::cout << error << endl;
        }
    }
}