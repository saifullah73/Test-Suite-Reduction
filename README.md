# Test Suite Reduction Algorithms
A set of javascript tools to reduce test suite size via delta debugging,linear search, and binary search designed to run on mutode2 csv ouput files. Feature selection is also used to select most correlated test cases with respect to mutation score (tools/correlations.py)  
## Usage
The tools works on the csv outputs of mutode2  
### Linear Search Algorithm
`node linMin.js <path to csv> <tolerance>`

### Binary Reduction
`node binaryMin.js <path to csv> <tolerance>`  

### Delta Debugging
`node ddMin.js <path to csv> <tolerance> <number of runs>`  

