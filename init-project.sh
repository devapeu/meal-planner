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
STAGING=0   # set to 1 when testing

mkdir -p "$DOMAIN_DIR"
mkdir -p "$WEBROOT"

echo "=== Checking certificates for $DOMAIN ==="

# ---------------------------------------------------------------------------
# 1. Create dummy cert if none exists
# ---------------------------------------------------------------------------
if [ ! -f "$DOMAIN_DIR/fullchain.pem" ]; then
    echo "No certificate found. Creating dummy cert..."

    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$DOMAIN_DIR/privkey.pem" \
        -out "$DOMAIN_DIR/fullchain.pem" \
        -subj "/CN=$DOMAIN"
    
    cp "$DOMAIN_DIR/fullchain.pem" "$DOMAIN_DIR/chain.pem"

    echo "Dummy cert created."
else
    echo "Certificate already exists. Using current files."
fi

# ---------------------------------------------------------------------------
# 2. Start nginx so certbot can challenge via HTTP-01
# ---------------------------------------------------------------------------
echo "=== Starting nginx container ==="
docker compose -f docker-compose.prod.yml up -d nginx
sleep 3

# ---------------------------------------------------------------------------
# 3. Request real Let's Encrypt certificate (webroot)
# ---------------------------------------------------------------------------
echo "=== Requesting real certificate for $DOMAIN ==="

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

echo "Certificate request complete."

# ---------------------------------------------------------------------------
# 4. Reload nginx to load the new cert
# ---------------------------------------------------------------------------
echo "=== Reloading nginx with real certificate ==="
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "=== SSL setup done. HTTPS should now be active at https://$DOMAIN ==="
