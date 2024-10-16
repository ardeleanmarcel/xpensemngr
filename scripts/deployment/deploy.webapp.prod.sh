#!/bin/bash

BUCKET_NAME="xpm-bucket-webapp-prod"
AWS_REGION="eu-central-1"
BUILD_DIR="dist"

# Colors for logging
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No color

# Functions
log() {
    echo -e "${GREEN}$1${NC}"
}

error() {
    echo -e "${RED}$1${NC}"
}

log "Building the Vite project..."
cd ../../webapp && rm -rf $BUILD_DIR && npm run build

if [ $? -ne 0 ]; then
    error "Vite build failed!"
    exit 1
fi

log "Syncing $BUILD_DIR with S3 bucket: $BUCKET_NAME"
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete

if [ $? -ne 0 ]; then
    error "S3 sync failed!"
    exit 1
fi

log "Files successfully deployed to S3!"
