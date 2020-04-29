import pandas as pd
import numpy as np
import sys
import datetime
import os.path


a = datetime.datetime.now()

path = sys.argv[1]
dataset = pd.read_csv(path)
X = dataset.iloc[:,:-1]
y = dataset.iloc[:,-1]

if ((len(sys.argv)) > 2):
    num_feats =  int(sys.argv[2])
else:
    num_feats = int(len(X.columns.tolist())/2)

print("Selecting "+ str(num_feats)+ " features")

def checkAndWriteHeader():
    if not os.path.isfile('correlationOutput.csv'):
        with open('correlationOutput.csv', mode='a') as file:
            file.write("datetime,executionTime,TestCasesPicked,OriginalSetSizes,SetSizePicked,Correlations,MutationScore\n");

def outputToCSV(output):
    checkAndWriteHeader()
    with open('correlationOutput.csv', mode='a') as file:
        file.write(output+"\n");

def convertListToString(list):
    output = ""
    for i in list:
        output+= str(i)+ " "
    return output



def cor_selector(X, y,num_feats):
    cor_list = []
    feature_name = X.columns.tolist()
    # calculate the correlation with y for each feature
    for i in X.columns.tolist():
        cor = np.corrcoef(X[i], y)[0, 1]
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
        if x < num_feats - 1:
            print(x, end = ",")
        else:
            print(x)
print()
print("Selected Set Size = ", len(selected))
print("OriginalSetSize = ", len(cor_support))
try:
    mut = str(getMutationScore(list(selected.keys()),len(cor_support)))
    print("Mutation Score: ",mut , "%")
except:
    mut = "Can't determine"
    print("Can't determine mutation score, row combination not found in dataset.")
b = datetime.datetime.now()
c = b-a
print("Running Time: %ssec %.1f milliseconds" %(c.seconds,c.microseconds/1000))
datetime = b.strftime("%Y-%m-%d %H:%M:%S")
extime = str(c.seconds) + "s"+str(c.microseconds/1000)+"ms";
testCases = convertListToString(list(selected.keys()))
corr = convertListToString(list(selected.values()))
outputToCSV(str(datetime)+","+extime+","+testCases+","+str(len(cor_support))+","+str(len(selected))+","+corr+","+mut)

