#!/bin/bash
old_version=0.0.23
new_version=0.0.24
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
