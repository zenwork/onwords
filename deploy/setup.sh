echo "BUILD FOR PROD"

echo
node --version
npm --version
cd "$(dirname "$0")" || exit

echo
echo "--> setup apache proxy"
apache/setup.sh

echo
echo "--> setup onwords"
cd ../site || (echo "[../site] directory not found" & exit 1)


if (npm prodstop && npm ci && npm run build); then
    echo "BUILD COMPLETED"
else
    echo "BUILD FAILED";
    exit 1;
fi
