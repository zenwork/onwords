echo "BUILD FOR PROD"

echo
node --version
npm --version

echo
echo "--> setup apache proxy"
apache/setup.sh

echo
echo "--> setup onwords"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit 1)

npm ci
if npm run build; then
    echo "BUILD COMPLETED"
else
    echo "BUILD FAILED";
    # your termination logic here
    exit 1;
fi
