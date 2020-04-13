

line = input("Enter String: ")
line = str.strip(line)
line = line.split(",")
string = "\"("
for idx,l in enumerate(line):
	string+= "-"+str(l)+"-"
	if (idx != len(line) - 1):
		string+= "|"

string+= ")\""


print(string)