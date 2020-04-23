const fs = require('fs')
let args = process.argv.slice(2);
let pathToFile = args[0]

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


var swap = function(array, frstElm, scndElm) {

    var temp = array[frstElm];
    array[frstElm] = array[scndElm];
    array[scndElm] = temp;
}

var permutation = function(array, leftIndex, size) {

    var x;

    if(leftIndex === size) {

        temp = "";

        for (var i = 0; i < array.length; i++) {
            temp += array[i] + " ";
        }

        console.log("---------------> " + temp);

    } else {

        for(x = leftIndex; x < size; x++) {
            swap(array, leftIndex, x);
            permutation(array, leftIndex + 1, size);
            swap(array, leftIndex, x);
        }
    }
}

var combinations = function(array){
	var combi = [];
	for (var i = 0; i <= array.length; i++){
		combi.push([])
	}
	var temp= "";
	var letLen = Math.pow(2, array.length);
	for (var i = 0; i < letLen ; i++){
    	temp= [];
    	for (var j=0;j<array.length;j++) {
        	if ((i & Math.pow(2,j))){ 
            	temp.push(array[j])
        	}
    	}
    	if (temp.length !== 0) {
        	combi[temp.length].push(temp);
    	}
	}
	return combi
}

var output = function(str){
	console.log(str);
	fs.appendFileSync("output.txt",str+"\n",'utf8')
}

var getRandomIndices = function(totalPicked,maxIndex){
	var arr = [];
	while(arr.length < totalPicked){
    	var r = Math.floor(Math.random() * maxIndex);
    		if(arr.indexOf(r) === -1) arr.push(r);
	}
	return arr
}


deleteFileIfExists('output.txt')
let list = CSVProcessor.getTestCases();
output("Orignal test cases = "+ list);
combinations = combinations(list);
output("Combinations = "+combinations.join("||"))
for (var idc = 1; idc < combinations.length; idc++){
	output("--------Size = "+idc+"--------")
	var indices = []
	if (combinations[idc].length > 10){
		indices = getRandomIndices(10,combinations[idc].length);
	}
	else{
		for (var i = 0; i<combinations[idc].length; i++){
			indices.push(i);
		}
	}
	output("Total Combinations found = "+ combinations[idc].length)
	output("Indices picked = "+indices);
 	var scores = []
 	for (var i = 0; i < indices.length ; i++){
 		var temp = combinations[idc][indices[i]]
 		var score = CSVProcessor.getMutationScore(temp);
 		scores.push(score);
 		output(indices[i] +". Mutation Score for "+temp +" = "+score+ "%");
 	}
	var sum = 0;
	for( var i = 0; i < scores.length; i++ ){
		scores[i] = parseFloat(scores[i]);
	    sum += scores[i]
	}
	var avg = sum/scores.length;
	output("Max mutation Score = "+ Math.max.apply(null,scores)+"%");
	output("Min mutation Score = "+ Math.min.apply(null,scores)+"%");
	output("Avg mutation Score = "+ avg+"%");
}