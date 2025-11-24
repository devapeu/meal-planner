#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Missing .env file."
    exit 1
fi

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "DOMAIN or EMAIL missing in .env"
    exit 1
fi

DOMAIN_DIR="./certbot/conf/live/$DOMAIN"
WEBROOT="./certbot/www"
RSA_SIZE=4096
STAGING=0  # set to 1 for testing

mkdir -p "$DOMAIN_DIR"
mkdir -p "$WEBROOT"

echo "=== Initializing SSL for $DOMAIN ==="

# ---------------------------------------------------------
# 1. Create dummy certificate (needed so nginx can start)
# ---------------------------------------------------------
echo "=== Creating temporary dummy certificate ==="

openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$DOMAIN_DIR/privkey.pem" \
    -out "$DOMAIN_DIR/fullchain.pem" \
    -subj "/CN=$DOMAIN"

cp "$DOMAIN_DIR/fullchain.pem" "$DOMAIN_DIR/chain.pem"

echo "Dummy certificate generated."


# ---------------------------------------------------------
# 2. Start nginx so Certbot can complete its challenge
# ---------------------------------------------------------
echo "=== Starting nginx container (HTTP only) ==="
docker compose -f docker-compose.prod.yml up -d nginx
sleep 3


# ---------------------------------------------------------
# 3. Request real Let's Encrypt certificate
# ---------------------------------------------------------
echo "=== Requesting Let's Encrypt certificate ==="

# Remove dummy certificate so Certbot can create a fresh one
echo "=== Removing dummy certificate ==="
rm -rf "$DOMAIN_DIR"

STAGING_ARG=""
[ "$STAGING" -ne 0 ] && STAGING_ARG="--staging"

docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
  -d $DOMAIN \
  --email $EMAIL \
  --rsa-key-size $RSA_SIZE \
  --agree-tos \
  --force-renewal \
  $STAGING_ARG" certbot

echo "Real certificate obtained."


# ---------------------------------------------------------
# 4. Reload nginx to activate HTTPS
# ---------------------------------------------------------
echo "=== Reloading nginx with the real certificate ==="
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "=== SSL is live at https://$DOMAIN ==="
