echo -e "Checking if Docker is installed..."
if command -v docker >>temp.log; then
  echo -e "${GREEN}Docker found!${NC}"
else
  echo -e "${RED}Error:Docker is not installed!${NC}"
  exit 1
fi

echo -e "Checking if NodeJS is installed..."
if command -v node >>temp.log; then
  echo -e "${GREEN}NodeJS found!${NC}"
else
  echo -e "${RED}Error:NodeJS is not installed!${NC}"
  exit 1
fi

echo -e "Checking if openssl is installed..."
if command -v openssl >>temp.log; then
  echo -e "${GREEN}openssl found!${NC}"
else
  echo -e "${RED}Error:openssl is not installed!${NC}"
  exit 1
fi

rm temp.log
