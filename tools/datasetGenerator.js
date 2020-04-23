const fs = require('fs')
let args = process.argv.slice(2);
let pathToFile = args[0]

var flage = false;
var deleteFileIfExists = function(path){
	if (fs.existsSync(path)){
		fs.unlinkSync(path);
	}
}
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




var combinations = function(array){
	var combi = [];
	var temp= "";
	var letLen = Math.pow(2, array.length);

	for (var i = 0; i < letLen ; i++){
		if (combi.length > 10000){
			flag = true;
			break;
		}
    	temp= [];
    	for (var j=0;j<array.length;j++) {
        	if ((i & Math.pow(2,j))){ 
            	temp.push(array[j])
        	}
    	}
    	if (temp.length !== 0) {
        	combi.push(temp);
    	}
	}
	return combi
}

var output = function(str){
	fs.appendFileSync("output.csv",str+"\n",'utf8')
}

var getRandomIndices = function(totalPicked,maxIndex){
	var arr = [];
	while(arr.length < totalPicked){
    	var r = Math.floor(Math.random() * maxIndex) + 1;
    		if(arr.indexOf(r) === -1) arr.push(r);
	}
	return arr
}

var getString = function(combinationsArr,orgTestCaseSize,score){
	newArr = []
	for (var i = 0; i < orgTestCaseSize ; i++){
		if (combinationsArr.includes(i+'')){
			newArr.push(1);
		}
		else{
			newArr.push(0);	
		}
	}
	newArr.push(score);
	return newArr.join(",");

}

var getHeader = function(orgTestCaseSize){
	var header = []
	for(var i = 0; i < orgTestCaseSize; i++){
		header.push("Test"+i);
	}
	header.push("Score");
	return header.join(",");

}

deleteFileIfExists('output.csv')
let list = CSVProcessor.getTestCases();
console.log("Orignal test cases = "+ list);
combinations = combinations(list);
console.log("Total Combinations found = "+ combinations.length)
output(getHeader(list.length));
for (var i = 0; i < combinations.length ; i++){
	var temp = combinations[i]
	var score = CSVProcessor.getMutationScore(temp);
	console.log(combinations[i] +". Mutation Score for "+temp +" = "+score+ "%");
	output(getString(temp,list.length,score));
}
if (flag){
	console.log("Too many combinations possible, restricted to 100000 results")
}