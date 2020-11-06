const fs = require('fs')
let args = process.argv.slice(2);
let pathToFile = args[0]
let string = args[1]

var CSVProcessor = (function(path){
	let header = null;
	let data = fs.readFileSync(path,'utf8');
    let templines = data.split('\n')
    header = templines.slice(0,1)[0].split('|').splice(2);
    let testCases = header.map(line=>line.split('-')[0]);
    let linesExceptFirst = templines.slice(1,templines.length-1); //uptil the last item(exclusive) since it is empty string
    let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));
    lines = linesArr.filter(line=>line.indexOf('-1') === -1 && line.indexOf('-2') === -1)
    totalmutants = lines.length;

	return{
		getTestCases : function(){
			return testCases;
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
	};
})(pathToFile);

string = string.split(",")
arr = []
for (var s of string){
	arr.push(parseInt(s))
}
console.log("Mutation Score: "+(CSVProcessor.getMutationScore(arr)))