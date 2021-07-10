echo "BUILD FOR PROD"
echo
echo "--> install latest nodejs "
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
node -e "console.log('Running Node.js ' + process.version)"
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
