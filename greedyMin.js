const chalk = require('chalk')
const fs = require('fs')

var start = new Date().getTime();
let args = process.argv.slice(2);
let pathToFile = args[0]
let debug = false
if (args[1] === 'debug')
	debug = true

let outputName = pathToFile.split("/");
outputName = outputName[outputName.length-1]
outputName = outputName.replace(".csv","");

var CSVProcessor = (function(path){
	let lines = null;
	let header = null;
	let totalmutants = null;
	let totalTestCases = null;
	let data = fs.readFileSync(path,'utf8');
    // Get an array of comma separated lines`
    let templines = data.split('\n')
    header = templines.slice(0,1)[0].split('|').splice(2);
    let linesExceptFirst = templines.slice(1,templines.length-1); //uptil the last item(exclusive) since it is empty string

    let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));
	
    
    //lines = linesArr.map(line => line.splice(line.length-1)); //do not uncomment
	

    lines = linesArr.filter(line=>line.indexOf('-1') === -1 && line.indexOf('-2') === -1)

	for(var i = 0; i < lines.length;i++){
		var last = lines[i][lines[i].length - 1]
		last = last.split('\r')[0]
		lines[i][lines[i].length-1] = last
	}

    
    
    totalmutants = lines.length;
    totalTestCases = lines[0].length;

    if (debug){
		var debugHeader = "iter,"
		let i = 0;
		while (i < totalTestCases){
			debugHeader += "TestCase "+i+" Kills,"
			i++;
		}
		debugHeader+="Selected TestCase"
		fs.writeFileSync("greedyMinDebug.csv",debugHeader+"\n",'utf8')
    }

	// console.log(`${chalk.bgGreen("totalmutants = "+totalmutants)}`);
	// console.log(`${chalk.bgGreen("Header = "+header)}`);
	// console.log(`${chalk.bgGreen("Total Test Cases = "+totalTestCases)}`);
	// console.log(lines);

	var findTestCaseWithMostKills = function(linesArr,testCaseIndices){
		let mutantsKilledByTestCase = new Array(totalTestCases).fill(0);
			for (let idx of testCaseIndices){
				for (let line of linesArr){
					if (line[idx] === '0'){
						mutantsKilledByTestCase[idx] += 1
					}
				}
			}
			// console.log("Killed=")
			// console.log(mutantsKilledByTestCase);
			sum = mutantsKilledByTestCase.reduce((a, b) => a + b, 0)
			if (sum == 0 ){
				debugStr = null
				if (debug){
					debugStr = mutantsKilledByTestCase + "," + null
				}
				return [null,debugStr]
			}
			else{
				let testCaseWithMostKills = null
				tiedkills = []
				maxKills = Math.max(...mutantsKilledByTestCase)
				let x = 0
				while (x < mutantsKilledByTestCase.length){
					if (mutantsKilledByTestCase[x] == maxKills)
						tiedkills.push(x)
					x++;
				}
				// console.log("Tied Kills...")
				// console.log(tiedkills)
				if (tiedkills.length > 1){
					testCaseWithMostKills = tiedkills[Math.floor(Math.random() * tiedkills.length)];
				}
				else{
					testCaseWithMostKills = tiedkills[0]
				}
				// console.log(testCaseWithMostKills)
				// testCaseWithMostKills = mutantsKilledByTestCase.indexOf(Math.max(...mutantsKilledByTestCase));
				debugStr = null
				if (debug){
					debugStr = mutantsKilledByTestCase + "," + testCaseWithMostKills
				}
				return [testCaseWithMostKills,debugStr] 
			}
	}

	var filterMutants = function(testCaseIndex,linesArr){
			newLinesArr = [];
			for (let line of linesArr){
					if (line[testCaseIndex] !== '0'){
						newLinesArr.push(line);
					}
				}
			return newLinesArr
		}
	var debugOutput = function(iter,debugStr){
		let str = iter + "," + debugStr + "\n"
		fs.appendFileSync("greedyMinDebug.csv",str,'utf8')
	}
	return{
		performSelection: function(){
			let seletedSet = [];
			let testCaseIndices = [];
			let i = 0;
			while (i < totalTestCases){
				testCaseIndices.push(i);
				i++;
			}
			let linesArr = lines
			let testCaseWithMostKills = null
			let debugStr = null
			let iter = 0
			while (linesArr.length > 0){
				[testCaseWithMostKills,debugStr] = findTestCaseWithMostKills(linesArr,testCaseIndices);
				// console.log("Test Case With Most Kills = "+ testCaseWithMostKills);
				if (testCaseWithMostKills === null)
					break
				// console.log("testCaseIndices=");
				// console.log(testCaseIndices)
				const index = testCaseIndices.indexOf(testCaseWithMostKills);
				// console.log("Index = ");
				// console.log(index)
				if (index > -1) {
					testCaseIndices.splice(index, 1);
					seletedSet.push(testCaseWithMostKills);
					linesArr = filterMutants(testCaseWithMostKills,linesArr);
					if (debug){
						debugOutput(iter,debugStr);
					}
				}
				// console.log("Selected Set = "+ seletedSet);
				// console.log(linesArr);
				iter++;
			}
			return seletedSet

		},
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
			return ((killedMutants/totalmutants)*100).toFixed(2);
		},
		getTotalMutants : function(){
			return totalmutants;
		},
		getHeader : function(){
			return header;
		},
		outputCSVHeader: function(){
			if (!fs.existsSync("greedyMinOutputs.csv")){
				var header = "DateTime,Name,TotalMutants,ExecutionTime(ms),ExecutionTime,MutationScoreOriginal,MutationScoreReduced,ReducedSet,OriginalSetSize,ReducedSetSize"
				fs.appendFileSync("greedyMinOutputs.csv",header+"\n",'utf8')
			}
		},
		outputToCSV: function(str){
			fs.appendFileSync("greedyMinOutputs.csv",str,'utf8')
		}
	};
})(pathToFile);


let reducedSet = CSVProcessor.performSelection();
var end = new Date().getTime();
var time = end - start;
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
let arr = [];
for (let i = 0; i < CSVProcessor.getHeader().length; i++){
	arr.push(i)
}
CSVProcessor.outputCSVHeader();
var datetime = ""
var d = new Date();
var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"]
datetime = d.getDate()+" "+months[d.getMonth()]+";"+d.getHours()+"h:"+d.getMinutes()+"min:"+d.getSeconds()+"sec";
var str = datetime+","+outputName+","+CSVProcessor.getTotalMutants()+","+time+"ms"+","+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms"+","+CSVProcessor.getMutationScore(arr)+","+CSVProcessor.getMutationScore(reducedSet)+","+reducedSet.join(" ")+","+CSVProcessor.getHeader().length+","+reducedSet.length+"\n";
CSVProcessor.outputToCSV(str)
console.log(`${chalk.bgMagenta("Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms")}`)
console.log(`${chalk.bgMagenta("Mutation Score for originalSet = " + CSVProcessor.getMutationScore(arr) + " %")}`)
console.log(`${chalk.bgMagenta("Mutation Score for reducedSet = " + CSVProcessor.getMutationScore(reducedSet) + " %")}`)
console.log(`${chalk.bgMagenta("Reduced set :")}    ${reducedSet}`)
console.log(`${chalk.bgMagenta("Reduced set Size :")}    ${reducedSet.length}`)
console.log(`${chalk.bgMagenta("Original set Size :")}    ${CSVProcessor.getHeader().length}`)
