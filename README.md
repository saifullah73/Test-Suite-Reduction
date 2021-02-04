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
Example   
`node ddMin-ensemble.js 10 experiments/async-new.csv 10`
