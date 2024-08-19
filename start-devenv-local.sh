#!/bin/bash

CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

webapp="cd webapp && npm run dev"
api="cd api && npm run dev"

run_with_prefix() {
  local prefix="$1"
  local color="$2"
  shift 2
  {
    eval "$@" 2>&1 | while IFS= read -r line; do
      echo -e "${color}[${prefix}]${NC} ${line}"
    done
  }
}

docker compose up database -d

run_with_prefix "WEBAPP" "$CYAN" "${webapp[@]}" &
run_with_prefix "API" "$GREEN" "${api[@]}" &
wait
