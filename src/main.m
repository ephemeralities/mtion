int a = 8;
int b = 9;

int c = a + b;

fn add int a, int b => int : 
    ret a + b;;

fn sub int a, int b => int :
    ret a - b;;
    

fn testfunc str string, int index => bool :
    
    int string = fn.string.length;
    
    ret fn.string;;
    

fn init => none:
    for int i {0, 10, 1}:
        //consistent int sum;
        print i;;
    
fn main => none:
    

int flag; 

fn asm _add{unsafe} int a, int b, int .store => int :
    LD a, $A
    LD b, $H
    ADD $H
    STORE $A, .store
    
add 10, 9, flag;