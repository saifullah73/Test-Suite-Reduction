# Test Suite Reduction Algorithms
A set of javascript tools to reduce test suite size via delta debugging,linear search, and binary search designed to run on mutode2 csv ouput files.  
## Usage
### Linear Search Algorithm
`node linMin.js <path to csv> <tolerance>`

### Binary Reduction
`node binaryMin.js <path to csv> <tolerance>`  

### Delta Debugging
`node ddMin.js <path to csv> <tolerance>`

The tools works on the csv outputs of mutode2
