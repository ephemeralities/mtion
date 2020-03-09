const OP_CODES = [
    'ADD',
    'ADC',
    'AND',
    'BIT',
    'CALL',
    'CCF',
    'CP',
    'HALT',
    'SUB',
    'JP',
    'LD',
    'OR',
    'POP',
    'PUSH'
];
    
//Operations in code
function Operation(){
    this.op_code;
    this.values = [];
    this.cycles;            //Machine cycle length of the operation
}


//will find how many cycles it will take to run data (whether it be a single operation, file, or function)
function cycle_length(data){
    
}