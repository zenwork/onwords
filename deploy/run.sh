echo "RUNNING SITE"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit )

if (npm run serve:prod); then
    echo "ONWORDS STARTED            :-)"
else
    echo "ONWORDS DID NOT STARTED    :-(";
    exit 1;
fi
