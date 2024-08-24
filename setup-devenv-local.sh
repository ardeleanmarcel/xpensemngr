#!/bin/bash

set -eu

export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export CYAN='\033[0;36m'
export NC='\033[0m' # No Color

DB_HOST='localhost'
DB_PORT='3033'
export DB_NAME='xpm'

MYE_WEB_UI_ROOT_URL='http://localhost:5173'

AUTH_JWT_SECRET=$(openssl rand -base64 32)

NOTIFICATION_EMAIL_SOURCE='account-activation@xpensemngr.com'

./scripts/local-env/check-software.sh

echo -e "${CYAN}
[XPM] Let's configure the DB credentials!
[XPM] Pick a username and password for connecting to your local database.
${NC}"

read -p "User: " DB_USER
read -p "Password: " DB_PASS

cat <<EOF >./database/.env
XPM_ENV=development

LOCAL_DB_HOST=$DB_HOST
LOCAL_DB_PORT=$DB_PORT
LOCAL_DB_NAME=$DB_NAME
LOCAL_DB_USER=$DB_USER
LOCAL_DB_PASS=$DB_PASS
EOF

cat <<EOF >./database/docker/.env
POSTGRES_DB=$DB_NAME
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASS
EOF

echo -e "${GREEN}[XPM] Database .env files created!${NC}"

echo -e "${CYAN}[XPM] We need a few more things for the API...
${NC}"

read -p "SendGrid API Key: " SENDGRID_API_KEY

cat <<EOF >./api/.env
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS

AUTH_JWT_SECRET=$AUTH_JWT_SECRET

MYE_WEB_UI_ROOT_URL=$MYE_WEB_UI_ROOT_URL

SENDGRID_API_KEY=$SENDGRID_API_KEY
NOTIFICATION_EMAIL_SOURCE=$NOTIFICATION_EMAIL_SOURCE
EOF

echo -e "${GREEN}[XPM] API .env file created!${NC}"

echo -e "${CYAN}
[XPM] Installing local packages...
${NC}"

cd api && npm ci && cd ../webapp && npm ci --force && cd ../database && npm ci && cd ..

echo -e "${CYAN}[XPM] Building docker images...
${NC}"

docker compose build

echo -e "${CYAN}
[XPM] Starting database and running migrations...
${NC}"

docker compose up database -d

./scripts/local-env/check-container.sh
cd database && npm run bootstrap && cd ..

echo -e "${CYAN}
[XPM] Stopping database docker container...
${NC}"

docker compose stop database

echo -e "${GREEN}
[XPM] Setup complete!
${NC}"

echo -e "${CYAN}[XPM] To connect to your local DB use the following:
      ${CYAN}Host:          ${YELLOW} $DB_HOST
      ${CYAN}Port:          ${YELLOW} $DB_PORT
      ${CYAN}Database name: ${YELLOW} $DB_NAME
      ${CYAN}User:          ${YELLOW} $DB_USER
      ${CYAN}Password:      ${YELLOW} $DB_PASS
${NC}"

echo -e "${CYAN}[XPM] To start local development use the ${YELLOW}start-devenv-local.sh ${CYAN}script.

Thank you for contributing to xpensemngr!
Have a great day :)"
