#!/bin/bash

# Replace with your PostgreSQL container name or ID
CONTAINER_NAME="xpensemngr-database-1"

# Maximum time to wait (in seconds)
TIMEOUT=30
INTERVAL=3

# Start time
START_TIME=$(date +%s)

# Loop until PostgreSQL is ready or timeout is reached
while true; do
  if docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" | grep -q "${CONTAINER_NAME}"; then
    if docker exec "${CONTAINER_NAME}" pg_isready; then
      echo -e "${GREEN}Database is up and accepting connections.${NC}"
      break
    else
      echo -e "${YELLOW}Database is not ready. Waiting...${NC}"
    fi
  else
    echo -e "${YELLOW}Database container is not running. Waiting...${NC}"
    # exit 1
  fi

  # Check if timeout is reached
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  if [ "$ELAPSED_TIME" -ge "$TIMEOUT" ]; then
    echo -e "${RED}Timeout reached. Database is not ready.${NC}"
    exit 1
  fi

  sleep "$INTERVAL"
done
