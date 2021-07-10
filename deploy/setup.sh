echo "BUILD FOR PROD"
echo
echo "--> install latest nodejs "
sudo apt update
sudo apt install --assume-yes nodejs
echo
echo "--> setup onwords"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit 1)
npm run build
echo "BUILD COMPLETED"
