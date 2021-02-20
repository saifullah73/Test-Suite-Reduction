const chalk = require('chalk')
const fs = require('fs')

var start = new Date().getTime();
let args = process.argv.slice(2);
let pathToFile = args[0]
let alpha = parseFloat(args[1])

let outputName = pathToFile.split("/");
outputName = outputName[outputName.length-1]
outputName = outputName.replace(".csv","");

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
			if (!fs.existsSync("linMinOutputs.csv")){
				var header = "DateTime,Name,MaxRR,tolerance,TotalMutants,ExecutionTime(ms),ExecutionTime,MutationScoreOriginal,MutationScoreReduced,ReducedSet,OriginalSetSize,ReducedSetSize"
				fs.appendFileSync("linMinOutputs.csv",header+"\n",'utf8')
			}
		},
		outputToCSV: function(str){
			fs.appendFileSync("linMinOutputs.csv",str,'utf8')
		}
	};
})(pathToFile);


var linMin = (function(mutationScorer,tolerance){


	var getRandomUnmarkedTestCase = function(arr,markers){
		var newArr = getAllUnmarkedTestCases(arr,markers);
		return newArr[Math.floor(Math.random() * newArr.length)]

	}

	var getAllUnmarkedTestCases = function(arr,markers){
		var newArr = []
		for (var i = 0 ; i < arr.length ; i++){
			if (markers[i] === 0){
				newArr.push(arr[i])
			}
		}
		return newArr;
	}

	var linearSearch = function(list_,markers,tolerance,maxRR){
		let ts = list_;
		var iter = 1; 
		while (markers.includes(0)){
			// console.log(`${chalk.bgMagenta("Iteration no. " + iter)}`)
			// console.log(`${chalk.red("TS = "+ ts)}  ${chalk.green("Makrers = " + markers)}`);
			let testCase = getRandomUnmarkedTestCase(list_,markers);
			// console.log(`${chalk.magenta("Test Case picked = "+ testCase)}`)
			markers[testCase] = 1;
			ts = ts.filter(e => e != testCase);
			// console.log(`${chalk.magenta("Score of testset " + ts + " = " + mutationScorer.getMutationScore(ts))}`)
			if (mutationScorer.getMutationScore(ts) + tolerance < maxRR){
				ts.push(testCase);
				// console.log("Adding it back");
			}
			else{
				// console.log("Not adding back");	
			}
			iter++;
		}
		return ts;
	}

	return {
		start: function(){
			CSVProcessor.outputCSVHeader();
			let arr = []
			for (let i = 0; i < CSVProcessor.getHeader().length; i++){
				arr.push(i)
			}
			var markers = new Array(arr.length).fill(0); //test cases number and their index in arrays are same
			let maxMutationScore = parseFloat(CSVProcessor.getMutationScore(arr));
			console.log(`${chalk.bgMagenta("MaxRR = "+ maxMutationScore)}`)
			console.log(`${chalk.bgMagenta("tolerance = "+ tolerance)}`)
			console.log(`${chalk.bgMagenta("Total mutants = "+ CSVProcessor.getTotalMutants())}`)
			console.log(`${chalk.bgMagenta("Test cases = " )} ${chalk.yellow("[ "+arr+" ]")}\n`)
			var datetime = ""
			var d = new Date();
			var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
			datetime = d.getDate()+" "+months[d.getMonth()]+";"+d.getHours()+"h:"+d.getMinutes()+"min:"+d.getSeconds()+"sec";
			var str = datetime+","+outputName+","+maxMutationScore+","+tolerance+","+CSVProcessor.getTotalMutants()+",";
			CSVProcessor.outputToCSV(str)
			return linearSearch(arr,markers,tolerance,maxMutationScore);
		}
	};
})(CSVProcessor,alpha);


let reducedSet = linMin.start();
var end = new Date().getTime();
var time = end - start;
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
let arr = [];
for (let i = 0; i < CSVProcessor.getHeader().length; i++){
	arr.push(i)
}
var str = time+"ms"+","+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms"+","+CSVProcessor.getMutationScore(arr)+","+CSVProcessor.getMutationScore(reducedSet)+","+reducedSet.join(" ")+","+CSVProcessor.getHeader().length+","+reducedSet.length+"\n";
CSVProcessor.outputToCSV(str)
console.log(`${chalk.bgMagenta("Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms")}`)
console.log(`${chalk.bgMagenta("Mutation Score for originalSet = " + CSVProcessor.getMutationScore(arr) + " %")}`)
console.log(`${chalk.bgMagenta("Mutation Score for reducedSet = " + CSVProcessor.getMutationScore(reducedSet) + " %")}`)
console.log(`${chalk.bgMagenta("Reduced set = ")}  ${reducedSet}`)
console.log(`${chalk.bgMagenta("Reduced set Size :")}    ${reducedSet.length}`)
console.log(`${chalk.bgMagenta("Original set Size :")}    ${CSVProcessor.getHeader().length}`)
