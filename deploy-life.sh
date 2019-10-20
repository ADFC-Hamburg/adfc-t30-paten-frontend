#!/bin/bash
ver=version$(grep version package.json |sed -e 's/\s*"version":\s"\(.*\)",/\1/')
ng build --base-href=https://t30forderung.hamburg.adfc.de/ --configuration=life --deploy-url=https://t30forderung.hamburg.adfc.de/
    sed -i -e 's/\(data-base-url="\)."/\1\/"/' dist/t30-paten/index.html &&
    rsync -r --delete -v dist/t30-paten/ root@tools:/var/www/t30forderung/frontend/
