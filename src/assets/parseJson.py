#!/usr/bin/python3
import json
from pprint import pprint
dateien= {
    1:'trotzdem_nicht_Tempo30.json',
    2:'KeinTempo30ohne.json',
    3:'tempo_30_neu.json',
}
data = []
newid = 0
for key, dateiname in dateien.items():
    print(key)
    f=open(dateiname,"rt")
    indata=json.load(f)
    f.close()
    for ele in indata['features']:
        neu = ele['properties']
        neu['art']=int(neu['A'])
        del(neu['A'])
        neu['Strasse']=neu['Straße']
        del(neu['Straße'])
        try:
            del(neu['C'])
        except KeyError:
            pass
        del(neu['Nr.'])
        neu['id'] = newid
        newid = newid +1
        neu['lat'] = ele['geometry']['coordinates'][1]
        neu['lon'] = ele['geometry']['coordinates'][0]
        neu['tempo30'] = int(key)
        data.append(neu)

with open('sozEinr.json', 'w') as fp:
        json.dump(data, fp)
