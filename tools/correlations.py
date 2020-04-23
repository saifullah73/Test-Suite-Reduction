import pandas as pd
import numpy as np
import sys
import time
start_time = time.time()
path = sys.argv[1]
if ((len(sys.argv)) > 2):
    num_feats =  int(sys.argv[2])
else:
    exit("Please provide number of test cases to be picked")
dataset = pd.read_csv(path)
X = dataset.iloc[:,:-1]
y = dataset.iloc[:,-1]
def cor_selector(X, y,num_feats):
    cor_list = []
    feature_name = X.columns.tolist()
    # calculate the correlation with y for each feature
    for i in X.columns.tolist():
        cor = np.corrcoef(X[i], y)[0, 1]
        cor_list.append(cor)
    # replace NaN with 0
    cor_list = [0 if np.isnan(i) else i for i in cor_list]
    print(corr_list)
    # feature name
    cor_feature = X.iloc[:,np.argsort(np.abs(cor_list))[-num_feats:]].columns.tolist()
    # feature selection? 0 for not select, 1 for select
    cor_support = [True if i in cor_feature else False for i in feature_name]
    return cor_support, cor_feature
if (num_feats > len(X.columns.tolist())):
    num_feats = len(X.columns.tolist())
cor_support, cor_feature = cor_selector(X, y,num_feats)
print(cor_support)
print(cor_feature)
print("Test Cases Picked: ")
for x in range(len(cor_support)):
    if cor_support[x]:
        if x < len(cor_support) -1:
            print(x, end = ",")
        else:
            print(x)

print("Running Time" % (time.time() - start_time))

