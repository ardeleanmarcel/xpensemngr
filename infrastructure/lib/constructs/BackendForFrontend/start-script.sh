#!/bin/bash

echo "[XPM] Setting up swap..."
dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab

echo "[XPM] Switching to ec2-user..."
su - ec2-user

[ -f ~/.bashrc ] || touch ~/.bashrc

echo "[XPM] Installing git..."
dnf install git -y

echo "[XPM] Installing jq..."
dnf install -y jq

echo "[XPM] Installing nvm and NodeJS..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "[XPM] Setting up NodeJS v20.12.2..."
nvm install 20.12.2
echo "[XPM] Checking node version..."
node -v

echo "[XPM] Installing pm2..."
npm install pm2 -g

echo "[XPM] Cloning xpensemngr repository..."
cd ~
git clone https://github.com/ardeleanmarcel/xpensemngr.git

echo "[XPM] Installing dependencies..."
cd ~/xpensemngr/api
npm install

# TODO (Valle) -> these can be dynamically obtained when the app is running, using the aws sdk
echo "[XPM] Setting up environment variables..."
# // Fetch the secret and parse the environment variables
AUTH_JWT_SECRET=$(aws secretsmanager get-secret-value --secret-id xpm-backend-for-frontend-env-var-prod --query SecretString --output text | jq -r .AUTH_JWT_SECRET)
XPM_ENV=$(aws secretsmanager get-secret-value --secret-id xpm-backend-for-frontend-env-var-prod --query SecretString --output text | jq -r .XPM_ENV)
MYE_WEB_UI_ROOT_URL=$(aws secretsmanager get-secret-value --secret-id xpm-backend-for-frontend-env-var-prod --query SecretString --output text | jq -r .MYE_WEB_UI_ROOT_URL)
SENDGRID_API_KEY=$(aws secretsmanager get-secret-value --secret-id xpm-backend-for-frontend-env-var-prod --query SecretString --output text | jq -r .SENDGRID_API_KEY)
NOTIFICATION_EMAIL_SOURCE=$(aws secretsmanager get-secret-value --secret-id xpm-backend-for-frontend-env-var-prod --query SecretString --output text | jq -r .NOTIFICATION_EMAIL_SOURCE)
DB_HOST=$(aws secretsmanager get-secret-value --secret-id xpm-rds-main-prod --query SecretString --output text | jq -r .host)
DB_PORT=$(aws secretsmanager get-secret-value --secret-id xpm-rds-main-prod --query SecretString --output text | jq -r .port)
DB_NAME=$(aws secretsmanager get-secret-value --secret-id xpm-rds-main-prod --query SecretString --output text | jq -r .dbname)
DB_USER=$(aws secretsmanager get-secret-value --secret-id xpm-rds-main-prod --query SecretString --output text | jq -r .username)
DB_PASS=$(aws secretsmanager get-secret-value --secret-id xpm-rds-main-prod --query SecretString --output text | jq -r .password)
# // Export the environment variables
export AUTH_JWT_SECRET
export XPM_ENV
export MYE_WEB_UI_ROOT_URL
export SENDGRID_API_KEY
export NOTIFICATION_EMAIL_SOURCE
export DB_HOST
export DB_PORT
export DB_NAME
export DB_USER
export DB_PASS
# // Save the environment variables to /etc/environment so they persist across reboots
echo "AUTH_JWT_SECRET=$AUTH_JWT_SECRET" >>/etc/environment
echo "XPM_ENV=$XPM_ENV" >>/etc/environment
echo "MYE_WEB_UI_ROOT_URL=$MYE_WEB_UI_ROOT_URL" >>/etc/environment
echo "SENDGRID_API_KEY=$SENDGRID_API_KEY" >>/etc/environment
echo "NOTIFICATION_EMAIL_SOURCE=$NOTIFICATION_EMAIL_SOURCE" >>/etc/environment
echo "DB_HOST=$DB_HOST" >>/etc/environment
echo "DB_PORT=$DB_PORT" >>/etc/environment
echo "DB_NAME=$DB_NAME" >>/etc/environment
echo "DB_USER=$DB_USER" >>/etc/environment
echo "DB_PASS=$DB_PASS" >>/etc/environment

# echo "[XPM] Setting up log rotation..."
# mkdir -p /etc/logrotate.d && cat >/etc/logrotate.d/nohup <<EOF
# /root/xpensemngr/api/nohup.out {
#     size 10M
#     rotate 5
#     compress
#     missingok
#     notifempty
#     copytruncate
# }
# EOF

# echo "[XPM] Setting up server autostart on reboot..."
# echo "[Unit]
# Description=Run xpensemanager API
# After=network.target

# [Service]
# ExecStart=/usr/bin/npm run start --prefix /root/xpensemanager/api
# WorkingDirectory=/root/xpensemanager/api
# Restart=always
# User=root
# StandardOutput=append:/var/log/xpensemanager.log
# StandardError=append:/var/log/xpensemanager.log

# [Install]
# WantedBy=multi-user.target" >/etc/systemd/system/xpensemanager.service

# systemctl enable xpensemanager.service
# systemctl start xpensemanager.service

echo "[XPM] Enabling log rotation..."
dnf install -y logrotate

echo "/var/log/xpensemanager.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 root root
}" >/etc/logrotate.d/xpensemanager

echo "[XPM] Testing log rotation..."
logrotate /etc/logrotate.d/xpensemanager --debug

echo "[XPM] Bulding and starting server..."
cd ~/xpensemngr/api
npm run build:prod
pm2 startup
pm2 start build/index.js --name xpm-api-bff --log /var/log/xpensemanager.log
pm2 save # will save the current process config so that it autostarts on reboot
