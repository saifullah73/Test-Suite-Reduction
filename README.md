# Test Suite Reduction Algorithms
A set of javascript tools to reduce test suite size via delta debugging,linear search, and binary search designed to run on mutode2 csv ouput files. Feature selection is also used to select most correlated test cases with respect to mutation score (tools/correlations.py)  
## Usage
The tools works on the csv outputs of [mutode2](https://github.com/saifullah73/mutode2)
### Linear Search Algorithm
`node linMin.js <path to csv> <tolerance>`

### Binary Reduction
`node binaryMin.js <path to csv> <tolerance> <number of runs>`  

### Delta Debugging
`node ddMin.js <path to csv> <tolerance>`

### LinMin-ensemble  
Executes multiple runs of LinMin  
`node linMin-ensemble.js <number of runs to execute> <path to csv> <tolerance>`  

### DDMin-ensemble  
Executes multiple runs of DDMin  
`node ddMin-ensemble.js <numbers of runs to execute> <path to csv> <tolerance>`  
#### Example   
`node ddMin-ensemble.js 10 experiments/async-new.csv 10`  

### Greedy Selection  
Does a selection of test cases which together kill all of mutants and returns a list of test cases ordered in decreasing manner of most mutants killed by test case (a csv output greedyMinOutputs.csv is also produced)  
`node greedyMin.js <path to csv> <debug>`  
#### Example  
For debug Mode, the script will produce a greedyMinDebug.csv output   
`node greedyMin.js files/uuid-new.csv debug`    
For normal mode  
`node greedyMin.js files/uuid-new.csv`  

### Delayed Greedy Selection  
Does a selection of test cases which together kill all of mutants and returns a list of test cases ordered in decreasing manner of most mutants killed by test case (a csv output delayedGreedyOutputs.csv is also produced)  
`node delayedGreedy.js <path to csv> 

#### Example  
`node delayedGreedy.js files/uuid-new.csv` 


### GreedyMin-ensemble  
Executes multiple runs of greedyMin  
`node greedyMin-ensemble.js <numbers of runs to execute> <path to csv>`  
