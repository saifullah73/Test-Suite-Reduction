const chalk = require('chalk')
const fs = require('fs');

//Reading the file
let args = process.argv.slice(2);
var path = args[0]
let data = fs.readFileSync(path,'utf8');
var lines = data.split("\n")
var start = new Date().getTime();



//Returns a mapping from mutants to the test cases that detect each of the mutants
function getMutantContext(lines){
        var mutantToTest = {}
        var line
        var outputs

        for(var i = 1;i < lines.length;i++){

             line = lines[i]
             outputs = line.split("|")
             if(outputs[0] === ""){
                 continue;
             }
             mutantToTest[outputs[0]] = []

             for(var j = 2; j < outputs.length; j++){
                if(parseInt(outputs[j]) == 0){

                 mutantToTest[outputs[0]].push(j-2)

                }
             }
             
        }
        return mutantToTest

}



function getTestCases(line){
    var cases = line.split("|")
    var testCases = []

    for (var i = 2;i < cases.length;i++){
        var test = parseInt(cases[i].split("-")[0])
        testCases.push(test)
    }
    return testCases

}


//Returns a mapping from the test cases to the mutants detected by each of the test cases

function getTestCaseContext(lines){
    var cases = getTestCases(lines[0])
    var mutantToTest = getMutantContext(lines)
    var testToMutant = []

    for (var i = 0; i< cases.length;i++){
        testToMutant[i] = []

        for(var mutant in mutantToTest){

            if(mutantToTest[mutant].includes(i)){
                testToMutant[i].push(mutant)
            }

        }

    }
    return testToMutant



}

function ownerReduction(mutantToTest,testToMutant){
    for(var mutant in mutantToTest){
        var object = 0
        var count = 0

        for(var i = 0; i < testToMutant.length; i++){
            if (testToMutant[i].includes(mutant)){
                object = i
                count += 1
            }
            if(count > 1){
                break
            }
        } 

        if(count == 1){
            run = true
            optimizedSuite.push(object)

            for(var mut in mutantToTest){

                if(mutantToTest[mut].includes(object)){
                    for (var test in testToMutant){

                        if(testToMutant[test].includes(mut)){
                            var idx = testToMutant[test].indexOf(mut)
                            testToMutant[test].splice(idx,1)
                        }
                    }
                    delete mutantToTest[mut]

                }
            }

           
            testToMutant[object] = []

        }
    }
    return testToMutant,mutantToTest
}

function attributeReduction(mutantToTest,testToMutant){

    for(var mutant1 in mutantToTest){
        for(var mutant2 in mutantToTest){

            if(mutant1 === mutant2){
                continue;
            }

            cover1 = mutantToTest[mutant1]
            cover2 = mutantToTest[mutant2]
            var is_subset = false

            for(var testcase of cover1){
                if(!(cover2.includes(testcase))){

                    //Not a subset
                    is_subset = false
                    break;
                }
                else{
                    is_subset = true
                }

            }
            if(is_subset){
                run = true

                for(var test of cover2){
                    var idx = testToMutant[test].indexOf(mutant2)
                    testToMutant[test].splice(idx,1)

                }
                delete mutantToTest[mutant2]

            }

        }
    }
    return testToMutant, mutantToTest

}

function objectReduction(mutantToTest,testToMutant) {

     for(var i = 0; i < testToMutant.length ; i++){
         for(var j = 0; j < testToMutant.length ; j++){
                if(i === j){
                    continue;
                }
                t1 = testToMutant[i]
                t2 = testToMutant[j]
                var isSuperset = false
                
                //is t1 and superset of t2 ? 
                if (t1.length >= t2.length){
                    
                    for( var mutant of t2){

                        if(!(t1.includes(mutant))){
                            isSuperset = false;
                            break;
                        }
                        isSuperset = true

                    }
                }

                else{
                    continue;
                }
                
                if(isSuperset){
                    run = true

                    for(var mutant of t2){
                        var idx = mutantToTest[mutant].indexOf(j)
                        mutantToTest[mutant].splice(idx,1)
                    }
                    testToMutant[j] = []
                    
                }

         }

    }

    return testToMutant,mutantToTest

    
}

function isNonEmpty(testToMutant) {
    var def = false
    for(var i = 0; i < testToMutant.length; i++){
        if(testToMutant[i].length > 0){
            def = true;
            break;
        }
    }
    return def
    
}

function takeGreedyStep(testToMutant){

    var max_idx = 0
    for(var i = 0; i < testToMutant.length; i++){

        if(testToMutant[i].length > testToMutant[max_idx].length){
            max_idx = i
        }
    }
    if(testToMutant[max_idx].length === 0){
        return
    }

    var mutants = testToMutant[max_idx]
    for(var mutant of mutants){
        for(var test_idx in testToMutant){
            if(testToMutant[test_idx].includes(mutant)){
                var idx = testToMutant[test_idx].indexOf(mutant)
                testToMutant[test_idx].splice(idx,1)

            }
        }   
    }
    optimizedSuite.push(max_idx)
    testToMutant[max_idx] = []
    return testToMutant

}

function getKilledMutants(testCases,lines){
    var mutantToTest = getMutantContext(lines)
    var killed = 0
    for(var mutant in mutantToTest){
        for (var test of testCases){

            if(mutantToTest[mutant].includes(test)){
                killed += 1
                break;
            }       
        }      
    }
    return killed;
    
}

function getMutationScore(killed ,total){
    var score = (killed/total)*100
    return score
}



var optimizedSuite = []

var mutantToTest = getMutantContext(lines);
var testToMutant = getTestCaseContext(lines);
var testCases = getTestCases(lines[0])




header = lines.slice(0,1)[0].split('|').splice(2);
let linesExceptFirst = lines.slice(1,lines.length-1); //uptil the last item(exclusive) since it is empty string
let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));
linesReduced = linesArr.map(line => line.splice(line.length-1)); //do not uncomment
linesReduced = linesArr.filter(line=>line.indexOf('-1') === -1 && line.indexOf('-2') === -1)
totalMutants = linesReduced.length


var killedMutants  = getKilledMutants(testCases,lines)
var mutationScore = getMutationScore(killedMutants, totalMutants)




//------Running Delayed Greedy Algorithm-------//

run = true
while(run && isNonEmpty(testToMutant)){
    run = false

    testToMutant,mutantToTest = objectReduction(mutantToTest,testToMutant)
    testToMutant,mutantToTest = attributeReduction(mutantToTest,testToMutant)
    testToMutant,mutantToTest = ownerReduction(mutantToTest,testToMutant)


}

while(isNonEmpty(testToMutant)){
    testToMutant = takeGreedyStep(testToMutant)
}

var end = new Date().getTime();
var time = end - start;
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
console.log(`${chalk.bgMagenta("Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms")}`)

killedMutants  = getKilledMutants(optimizedSuite,lines)
var opMutationScore = getMutationScore(killedMutants, totalMutants)
console.log(`${chalk.bgMagenta("Mutation Score for originalSet= ",mutationScore," %")}`)
console.log(`${chalk.bgMagenta("Mutation Score for reducedSet= ", opMutationScore," %")}`)
console.log(`${chalk.bgMagenta("Reduced set :")}    ${optimizedSuite}`)

console.log(`${chalk.bgMagenta("Reduced set Size: ", optimizedSuite.length)}`)
console.log(`${chalk.bgMagenta("Original set Size: ",testToMutant.length)}`)













