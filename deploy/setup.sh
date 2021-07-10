echo "BUILD FOR PROD"
echo
echo "--> install latest nodejs "
sudo apt-get update
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install --assume-yes nodejs npm
node --version
npm --version
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
