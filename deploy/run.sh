echo "RUNNING SITE"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit )
npm run serve
