#!/bin/bash
ver=version$(grep version package.json |sed -e 's/\s*"version":\s"\(.*\)",/\1/')
ng build --base-href=https://tools.adfc-hamburg.de/t30-paten/${ver}/ --prod --deploy-url=https://tools.adfc-hamburg.de/t30-paten/${ver}/ &&
    sed -i -e 's/\(data-base-url="\)."/\1\/t30-paten\/'${ver}'"/' dist/t30-paten/index.html &&
    git tag $ver &&
    git push origin $ver &&
    rsync -r --delete -v dist/t30-paten/ root@tools.adfc-hamburg.de:/var/www/html/t30-paten/${ver} &&
    ./sendVersionMail.sh &&
    npm version patch &&
    git push &&
    ssh root@tools.adfc-hamburg.de rm /var/www/html/t30-paten/latest &&
    ssh root@tools.adfc-hamburg.de ln -s ${ver} /var/www/html/t30-paten/latest
