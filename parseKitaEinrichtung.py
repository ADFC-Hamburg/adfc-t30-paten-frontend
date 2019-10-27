#!/usr/bin/python3
# Quelle: https://suche.transparenz.hamburg.de/dataset/kita-einrichtungen-hamburg10?forceWeb=true
file=open("/home/sven/Downloads/Kita_Einrichtung.csv");
lines= file.readlines();
file.close();

traeger_count = {}

for line in lines:
    cols= line.split("^")
    if (len(cols)>12):
        traeger=cols[12]
        if not traeger in traeger_count:
            traeger_count[traeger]=0
        traeger_count[traeger]=traeger_count[traeger]+1

i=10
for traeger, count in traeger_count.items():
    if (count >4):
        print("    '%s':%d," % (traeger,i))
        i=i+1
