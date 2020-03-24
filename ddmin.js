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
			return ((killedMutants/totalmutants)*100).toFixed(2);
		},
		getTotalMutants : function(){
			return totalmutants;
		},
		getHeader : function(){
			return header;
		}
	};
})(pathToFile);


var deltaDebugging = (function(mutationScorer,tolerance){
	const pass = 1;
	const fail = -1;
	const unresolved = 0;

	var pretty_outcome = function(outcome){
		if (outcome === 1){
			return "Pass";
		}
		else if (outcome === -1){
			return "Fail";
		}
		else if (outcome === 0){
			return "Unresolved";
		}
		else{
			return null;
		}
	}

	var splitList = function(list, n){
		let subsets = [];
		let start = 0;
		for (let i = 0; i < n; i++){
			let sublist = list.slice(start, start + (list.length - start) / (n - i));
			subsets.push(sublist);
			start += sublist.length;
		}
		return subsets;
	}

	var minus = function(listA,listB){
		let newlist = [];
		for (let a of listA){
			if (listB.indexOf(a) === -1){
				newlist.push(a);
			}
		}
		return newlist;
	}

	var _test = function(list,alpha,maxRR){
		// if (list.indexOf(1) !== -1 && list.indexOf(3) !== -1){
		// 	return fail;
		// }
		// return pass;
		let ms = parseFloat(mutationScorer.getMutationScore(list));
		if (ms + alpha >= maxRR){
			return [fail,ms];
		}
		return [pass,ms];
	}

	var test = function(list,alpha,maxRR){
		console.log(`${chalk.red("test("+list+")...")}`);
		let [outcome,ms] = _test(list,alpha,maxRR);
		console.log(`${chalk.red("test("+list+") = " + pretty_outcome(outcome)+ " Score = "+ ms)}`);
		return outcome;
	}

	var ddmin = function(list_,alpha,maxRR){
		let list = list_;
		console.log(`${chalk.bgGreen("ddmin(" + list + ")...")}`);
		/* add assertions here*/
		let n = 2;
		while (list.length >= 2){
			let subsets = splitList(list,n);
			console.log(subsets)
			console.log(`${chalk.bgRed("ddmin : testing subsets")}`);
			let some_comp_is_failing = false;
			for (let i = 0; i < subsets.length; i++){
				let subList = subsets[i];
				let complement = minus(list,subList);
				if (test(complement,alpha,maxRR) == fail){
					list = complement;
					n = Math.max(n-1,2);
					some_comp_is_failing = true;
					break;
				}
			}
			if (!some_comp_is_failing){
				if(n == list.length){
					break;
				}
				console.log(`${chalk.bgBlue("ddmin : increasing granularity")}`);
				n = Math.min(n * 2, list.length);
			}

		}
		console.log(`${chalk.bgGreen("ddmin(" + list_ + ") = " + list)}`);
		return list;
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
			return ddmin(arr,tolerance,maxMutationScore);
			//var l = [1,2,3,4]
			//return ddmin(l,tolerance,100);
		}
	};
})(CSVProcessor,alpha);


let reducedSet = deltaDebugging.start();
console.log(reducedSet)
