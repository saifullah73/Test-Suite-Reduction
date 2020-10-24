import pandas as pd
import numpy as np
import sys
import datetime
import os.path
import scipy.stats as stats

if (len(sys.argv) < 3):
    print("Please enter the input required in format")
    print("Format: python correlations.py <path to dataset file> <path to mutode2 file (used to generate dataset file)> {optional : <no of test cases to be picked (n)>}")
    exit()

a = datetime.datetime.now()
path = sys.argv[1]
pathToMutodeFile  = sys.argv[2]
outputName = path.split("/");
outputName = outputName[len(outputName)-1]
outputName = outputName.replace(".csv","");
print(outputName)
dataset = pd.read_csv(path)
X = dataset.iloc[:,:-1]
y = dataset.iloc[:,-1]

if ((len(sys.argv)) > 3):
    num_feats =  int(sys.argv[3])
else:
    num_feats = int(len(X.columns.tolist())/2)
    

print("Selecting "+ str(num_feats)+ " features")

def checkAndWriteHeader():
    if not os.path.isfile('correlationOutput.csv'):
        with open('correlationOutput.csv', mode='a') as file:
            file.write("datetime,name,executionTime,TestCasesPicked,OriginalSetSizes,SetSizePicked,Correlations,MutationScore\n");

def outputToCSV(output):
    checkAndWriteHeader()
    with open('correlationOutput.csv', mode='a') as file:
        file.write(output+"\n");

def convertListToString(list):
    output = ""
    for i in list:
        output+= str(i)+ " "
    return output

def fun(line): 
    if (('-1' in line) or ('-2' in line)): 
        return True
    else: 
        return False

def getMutationScoreHard(path,testCaseIndices):
    header = None;
    with open(path, 'r') as file:
        templines = file.readlines()
        linesExceptFirst = templines[1:len(templines)-1]
        linesArr = []
        for x in range(len(linesExceptFirst)):
            linesArr.append([])
            linesArr[x] = linesExceptFirst[x].split("|")[2:]
        lines= []
        count = 0
        for x in range(len(linesArr)):
            if (('-1' in linesArr[x]) or ('-2' in linesArr[x])): 
                pass
            else: 
                lines.append([])
                lines[count] = linesArr[x]
                count+=1
        totalmutants = len(lines)
        killedMutants = 0;
        for line in lines:
            for idx in testCaseIndices:
                if (line[idx] == '0'):
                    killedMutants += 1
                    break;
        return str(round(((killedMutants/totalmutants)*100),2))



def cor_selector(X, y,num_feats):
    cor_list = []
    feature_name = X.columns.tolist()
    # calculate the correlation with y for each feature
    for i in X.columns.tolist():
        cor = np.corrcoef(X[i], y)[0, 1]
        # cor = stats.pointbiserialr(X[i], y)
        # print(cor)
        cor_list.append(cor)
    # replace NaN with 0
    cor_list = [0 if np.isnan(i) else i for i in cor_list]
    # feature name
    cor_feature = X.iloc[:,np.argsort(np.abs(cor_list))[-num_feats:]].columns.tolist()
    print("Correlations: ",cor_list)
    # feature selection? 0 for not select, 1 for select
    cor_support = [True if i in cor_feature else False for i in feature_name]
    return cor_support, cor_list, cor_feature
if (num_feats > len(X.columns.tolist())):
    num_feats = len(X.columns.tolist())

def getMutationScore(selectedTestCases,totalTestCases):
    row = []
    for x in range(totalTestCases):
        if (x in selectedTestCases):
            row.append(1)
        else:
            row.append(0)
    data = X.values.tolist()
    index = data.index(row) 
    return y[index]


cor_support, cor_list, _ = cor_selector(X, y,num_feats) # true false array indicating which text case was picked,correlations,name of test cases picked
print("Test Cases Picked: ")
selected = {}
for x in range(len(cor_support)):
    if cor_support[x]:
        selected[x] = cor_list[x]
        print(x, end = ",")
print()
print("Selected Set Size = ", len(selected))
print("OriginalSetSize = ", len(cor_support))
try:
    mut = str(getMutationScore(list(selected.keys()),len(cor_support)))
    print("Mutation Score: ",mut , "%")
except:
    try:
        mut = getMutationScoreHard(pathToMutodeFile,list(selected.keys()))
        print("Mutation Score: ",mut , "%")
    except (e):
        mut = "Can't determine"
        print("An error occurred trying to determine MutationScore, please verify if your inputs were correct")
    
b = datetime.datetime.now()
c = b-a
print("Running Time: %ssec %.1f milliseconds" %(c.seconds,c.microseconds/1000))
datetime = b.strftime("%Y-%m-%d %H:%M:%S")
extime = str(c.seconds) + "s"+str(c.microseconds/1000)+"ms";
testCases = convertListToString(list(selected.keys()))
corr = convertListToString(list(selected.values()))
outputToCSV(str(datetime)+","+outputName+","+extime+","+testCases+","+str(len(cor_support))+","+str(len(selected))+","+corr+","+mut)

