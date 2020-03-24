const chalk = require('chalk')
const fs = require('fs')

let args = process.argv.slice(2);
let pathToFile = args[0]
let alpha = parseFloat(args[1])

var CSVProcessor = (function(path){
	let lines = null;
	let header = null;
	let totalmutants = null;
	let data = fs.readFileSync(path,'utf8');
    // Get an array of comma separated lines`
    let templines = data.split('\n')
    header = templines.slice(0,1)[0].split('|').splice(2);
    let linesExceptFirst = templines.slice(1,templines.length-1); //uptil the last item(exclusive) since it is empty string

    let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));

    lines = linesArr.filter(line=>line.indexOf('-1') === -1 && line.indexOf('-2') === -1)
    totalmutants = lines.length;

	console.log(`${chalk.bgGreen("totalmutants = "+totalmutants)}`);
	console.log(`${chalk.bgGreen("Header = "+header)}`);
	console.log(lines);

	return{
		getMutationScore : function(testCaseIndices){
			let killedMutants = 0;
			for (let line of lines){
				for (let idx of testCaseIndices){
					if (line[idx] === '0'){
						killedMutants += 1
						break;
					}
				}
			}
			return parseFloat(((killedMutants/totalmutants)*100).toFixed(2));
		},
		getTotalMutants : function(){
			return totalmutants;
		},
		getHeader : function(){
			return header;
		}
	};
})(pathToFile);


var binarySearch = (function(mutationScorer,tolerance){


	var getSubset = function(arr,n){
		let result = new Array(n);
        let len = arr.length;
        let taken = new Array(len);
    	if (n > len)
        	throw new RangeError("getRandom: more elements taken than available");
    	while (n--) {
        	var x = Math.floor(Math.random() * len);
        	result[n] = arr[x in taken ? taken[x] : x];
        	taken[x] = --len in taken ? taken[len] : len;
    	}
    	return result;
	}

	var binarySearchRunner = function(list_, alpha, maxRR){
		let low = 0;
		let high = list_.length -1;
		let count = 0
		let arr = list_
		while (low <= high && count < 3){
			count = count + 1;
			let mid = low + Math.ceil((high - low)/2)
			let subset = getSubset(arr,Math.ceil(high-low));
			let m = mutationScorer.getMutationScore(subset)
			console.log(`${chalk.bgGreen("low = "+ low + " high = "+ high + " mid = "+ mid)} ${chalk.green("Mutation Score = "+m)}   ${chalk.red(subset)} \n`)
			if (m + alpha < maxRR){
				low = mid + 1
			}
			if (m + alpha > maxRR){
				high = mid -1
			}
			if (m + alpha == maxRR){
				return subset
			}
			arr = subset;

		}
	}

	return {
		start: function(){
			let arr = []
			for (let i = 0; i < CSVProcessor.getHeader().length; i++){
				arr.push(i)
			}
			let maxMutationScore = parseFloat(CSVProcessor.getMutationScore(arr));
			console.log(`${chalk.bgMagenta("MaxRR = "+ maxMutationScore)}`)
			console.log(`${chalk.bgMagenta("tolerance = "+ tolerance)}`)
			console.log(`${chalk.bgMagenta("Total mutants = "+ CSVProcessor.getTotalMutants())}`)
			console.log(`${chalk.bgMagenta("Test cases = " )} ${chalk.yellow("[ "+arr+" ]")}`)
			return binarySearchRunner(arr,tolerance,maxMutationScore);
		}
	};
})(CSVProcessor,alpha);


let reducedSet = binarySearch.start();
console.log(reducedSet)
