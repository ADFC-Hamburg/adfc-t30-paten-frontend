#!/bin/bash
old_version=$(git tag |grep version |sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n  |tail -2 |head -1)
new_version=version$(grep version package.json |sed -e 's/\s*"version":\s"\(.*\)",/\1/')
output=$(mktemp)

cat >$output <<EOF

Hallo,

es gibt eine neue Version unter:

https://tools.adfc-hamburg.de/t30-paten/version${new_version}

Änderungen:
EOF
git log --no-merges --pretty=medium version${old_version}..version${new_version} >>$output

cat >>$output <<EOF

--
Diese Mail wurde automatisch erstellt von $0
EOF
mutt pg-karten@lists.hamburg.adfc.de -c tempo30@hamburg.adfc.de -c wiebke.hansen@hamburg.adfc.de -s "[ADFC-Paten] Neue Frontend Version ${new_version}" <$output
