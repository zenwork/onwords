echo 'APACHE 2 CONFIGURE'

#sudo apt install certbot python3-certbot-apache
#sudo certbot --apache --domain www.onwords.ch --reinstall --redirect

## enable modules
#sudo a2enmod proxy
#sudo a2enmod proxy_http
#sudo a2enmod proxy_balancer
#sudo a2enmod lbmethod_byrequests

## add configs
sudo cp apache/Apache2Proxy-ssl.conf /etc/apache2/sites-available/Apache2Proxy-ssl.conf
sudo cp apache/Apache2Proxy.conf /etc/apache2/sites-available/Apache2Proxy.conf

## remove all sites
sudo rm /etc/apache2/sites-enabled/*

## enable and restart
sudo a2ensite Apache2Proxy.conf
sudo a2ensite Apache2Proxy-ssl.conf
sudo systemctl restart apache2

echo 'APACHE 2 CONFIGURED'
