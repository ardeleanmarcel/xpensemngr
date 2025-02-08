#!/bin/bash

sudo bash

# this changes the cloud.cfg file so that the script gets run on every reboot
cp /etc/cloud/cloud.cfg /etc/cloud/cloud.cfg.bak
sudo sed -i 's/ - scripts-user/ - scripts-user\n - [scripts-user, always]/' /etc/cloud/cloud.cfg

[ -f ~/.bashrc ] || touch ~/.bashrc

echo "[XPM] Installing git..."
dnf install git -y

echo "[XPM] Installing nvm and NodeJS..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "[XPM] Setting up NodeJS v20.12.2..."
nvm install 20.12.2
echo "[XPM] Checking node version..."
node -v

echo "[XPM] Cloning xpensemngr repository..."
cd ~
git clone https://github.com/ardeleanmarcel/xpensemngr.git

echo "[XPM] Installing dependencies..."
cd ~/xpensemngr/api
npm install

cp .env.example .env

mkdir -p /etc/logrotate.d && cat >/etc/logrotate.d/nohup <<EOF
/root/xpensemngr/api/nohup.out {
    size 10M
    rotate 5
    compress
    missingok
    notifempty
    copytruncate
}
EOF
