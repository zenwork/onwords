echo "BUILD FOR PROD"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit 1)
npm run build
echo "BUILD COMPLETED"
