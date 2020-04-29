const chalk = require('chalk')
const fs = require('fs')

var start = new Date().getTime();
let args = process.argv.slice(2);
let pathToFile = args[0]
let alpha = parseFloat(args[1])
let runs = parseFloat(args[2])

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

	// console.log(`${chalk.bgGreen("totalmutants = "+totalmutants)}`);
	// console.log(`${chalk.bgGreen("Header = "+header)}`);
	// console.log(lines);

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
		},
		outputCSVHeader: function(){
			if (!fs.existsSync("binaryMinOutputs.csv")){
				var header = "DateTime,MaxRR,tolerance,TotalMutants,ExecutionTime,MutationScoreOriginal,MutationScoreReduced,ReducedSet,OriginalSetSize,ReducedSetSize"
				fs.appendFileSync("binaryMinOutputs.csv",header+"\n",'utf8')
			}
		},
		outputToCSV: function(str){
			fs.appendFileSync("binaryMinOutputs.csv",str,'utf8')
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
			CSVProcessor.outputCSVHeader();
			let arr = []
			for (let i = 0; i < CSVProcessor.getHeader().length; i++){
				arr.push(i)
			}
			let maxMutationScore = parseFloat(CSVProcessor.getMutationScore(arr));
			console.log(`${chalk.bgMagenta("MaxRR = "+ maxMutationScore)}`)
			console.log(`${chalk.bgMagenta("tolerance = "+ tolerance)}`)
			console.log(`${chalk.bgMagenta("Total mutants = "+ CSVProcessor.getTotalMutants())}`)
			console.log(`${chalk.bgMagenta("Test cases = " )} ${chalk.yellow("[ "+arr+" ]")}`)
			let set;
			let tol = tolerance - 5 ; //for first run, it'll be reset while in loop
			let flag = true;
			let a = 0
			while(a < runs && flag){
				tol = tol + 5;
				if (maxMutationScore - tol <= 0){
					tol = maxMutationScore; //difference is zero, i.e the final run
					flag = false;
				}
				console.log(`${chalk.green("Run : "+ (a+1) + "/"+ runs) } ${chalk.green("tolerance = "+ tol)}`)
				set = binarySearchRunner(arr,tol,maxMutationScore);
				if (set != undefined){
					return set
				}
				a++;
			}
			var datetime = ""
			var d = new Date();
			var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
			datetime = d.getDate()+" "+months[d.getMonth()]+";"+d.getHours()+"h:"+d.getMinutes()+"min:"+d.getSeconds()+"sec";
			var str = datetime+","+maxMutationScore+","+tolerance+","+CSVProcessor.getTotalMutants()+",";
			CSVProcessor.outputToCSV(str)
			return set
		}
	};
})(CSVProcessor,alpha);


let reducedSet = binarySearch.start();
var end = new Date().getTime();
var time = end - start;
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
let arr = [];
for (let i = 0; i < CSVProcessor.getHeader().length; i++){
	arr.push(i)
}
var str = minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms"+  ","+CSVProcessor.getMutationScore(arr)+",";
console.log(`${chalk.bgMagenta("Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms")}`)
console.log(`${chalk.bgMagenta("Mutation Score for original Set = " + CSVProcessor.getMutationScore(arr) + " %")}`)
if (reducedSet != undefined){
	console.log(`${chalk.bgMagenta("Mutation Score for reducedSet = " + CSVProcessor.getMutationScore(reducedSet) + " %")}`)
	str += CSVProcessor.getMutationScore(reducedSet)+","+reducedSet.join(" ")+","+CSVProcessor.getHeader().length+","+reducedSet.length+"\n";
}
else{
	console.log(`${chalk.bgRed("No set found")}`)
	str += "No set found"+","+"N/A"+","+CSVProcessor.getHeader().length+","+"N/A"+"\n";
}
CSVProcessor.outputToCSV(str)
console.log(`${chalk.bgMagenta("Reduced set = ")}   ${reducedSet}`)
