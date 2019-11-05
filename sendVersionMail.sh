#!/bin/bash
old_version=$(git tag |grep version |sort -t. -k 1,1 -k 2,2n -k 3,3n -k 4,4n  |tail -2 |head -1)
new_version=version$(grep version package.json |sed -e 's/\s*"version":\s"\(.*\)",/\1/')
output=$(mktemp)

cat >$output <<EOF

Hallo,

es gibt eine neue Version unter:

https://tools.adfc-hamburg.de/t30-paten/${new_version}

Änderungen:
EOF
git log --no-merges --pretty=medium ${old_version}..${new_version} >>$output

cat >>$output <<EOF

--
Diese Mail wurde automatisch erstellt von $0
EOF

cat $output
mutt pg-karten@lists.hamburg.adfc.de -c tempo30@hamburg.adfc.de -c wiebke.hansen@hamburg.adfc.de -c julian.lindner@hamburg.adfc.de -s "[ADFC-Paten] Neue Frontend Version ${new_version}" <$output
