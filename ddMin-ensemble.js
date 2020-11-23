const chalk = require('chalk')
const { execFileSync } = require('child_process');

var start = new Date().getTime();
let args = process.argv.slice(2);
let pathToFile = args[1]
let alpha = parseFloat(args[2])
let runs = parseFloat(args[0])

function runScript(pathToFile,alpha, callback) {
    const output = execFileSync("node",["ddMin.js",pathToFile,alpha])
    console.log(output.toString())
}

for (var i=0; i<runs; i++){
    console.log("Executing Run#"+(i+1))
    runScript(pathToFile,alpha, function (err) {
        if (err) throw err;
    });
}
var end = new Date().getTime();
var time = end - start;
time = Math.round(time/10,2)
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
let arr = [];
console.log(`${chalk.bgMagenta("Average Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms" + "("+time+" ms)")}`)