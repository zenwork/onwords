echo "RUNNING SITE"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit )

if (npm run prod:start); then
    echo "ONWORDS STARTED            :-)"
    npm run prod:logs
else
    echo "ONWORDS DID NOT STARTED    :-(";
    npm run prod:logs
    exit 1;
fi
