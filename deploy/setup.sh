echo "BUILD FOR PROD"
echo
echo "--> install latest nodejs "
sudo apt update
sudo apt install --assume-yes nodejs npm
echo
echo "--> setup onwords"
cd "$(dirname "$0")" || exit
cd ../site || (echo "[../site] directory not found" & exit 1)

if npm ci & npm run build; then
    echo "BUILD COMPLETED"
else
    echo "BUILD FAILED";
    # your termination logic here
    exit 1;
fi
