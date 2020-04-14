const fs = require('fs')
let args = process.argv.slice(2);
let string = args[0]
let path = args[1]
let type = args[2]
function getTestCaseNameString(path,string){
	let data = fs.readFileSync(path,'utf8');
	data = data.split('\n')
    let header = data.slice(0,1)[0].split('|').splice(2);
    let arr = getTestCaseNumbersArray(string)
    let output = "\"("
    for(let i = 0; i < arr.length ; i++){
    	let temp = header[parseInt(arr[i])]
    	temp = temp.replace(/[0-9]*-/,'');
		output += temp
		if (i != arr.length - 1){
			output+= "|"
		}
	}
	output+= ")\""
	if (type == 'escape'){
		output = output.replace(/"/g,"\\\\\\\"")
	}
	output = output.replace("\\\\\\\"","\\\"")
	output = output.replace(/(\\\\\\\")$/,"\\\"")
	return output
}

function getTestCaseNumbersArray(string){
	let x = string.trim();
	return x.split(",")
}

function getTestCaseNumberString(string){
	let str = getTestCaseNumbersArray(string)
	let output = "\"("
	for(let i = 0; i < str.length ; i++){
		output += "-"+str[i]+"-"
		if (i != str.length - 1){
			output+= "|"
		}
	}
	output+= ")\""
	return output
}

console.log("Outpus := \n\n")
if (path != undefined){
	console.log("NameString :== "+ getTestCaseNameString(path,string) + "\n\n")
}
console.log("NumberString :== "+ getTestCaseNumberString(string))