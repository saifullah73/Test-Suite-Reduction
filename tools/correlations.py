import pandas as pd
import numpy as np
import sys
import datetime


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
    return cor_support, cor_feature
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


cor_support, cor_feature = cor_selector(X, y,num_feats)
print("Test Cases Picked: ")
selected = []
for x in range(len(cor_support)):
    if cor_support[x]:
        selected.append(x)
        if x < len(cor_support) -1:
            print(x, end = ",")
        else:
            print(x)
print()
try:
    print("Mutation Score: ",getMutationScore(selected,len(cor_support)))
except:
    print("Can't determine mutation score, row combination not found in dataset.")
b = datetime.datetime.now()
c = b-a
print("Running Time: %ssec %.1f milliseconds" %(c.seconds,c.microseconds/1000))


