#!/bin/bash

# This script initializes Let's Encrypt SSL certificates for your domain
# Run this ONCE when setting up HTTPS for the first time

set -e

# Load environment variables
if [ -f .env ]; then
    set -a
    . .env
    set +a
else
    echo "Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$DOMAIN" ]; then
    echo "Error: DOMAIN not set in .env"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo "Error: EMAIL not set in .env (required for Let's Encrypt notifications)"
    exit 1
fi

domains=($DOMAIN)
rsa_key_size=4096
data_path="./certbot"
email="$EMAIL"
staging=0  # Set to 1 if you're testing your setup to avoid hitting request limits

echo "### Preparing SSL certificates for $domains ..."

# Download recommended TLS parameters if needed
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

# Check if certificate already exists
if [ -d "$data_path/conf/live/$domains" ]; then
  read -p "Existing certificate found for $domains. Continue and replace it? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

# Temporarily switch to HTTP-only config for certificate acquisition
echo "### Switching to HTTP-only config for certificate acquisition ..."
if [ -f nginx/conf.d/default.conf ]; then
  mv nginx/conf.d/default.conf nginx/conf.d/default-https.conf.tmp
fi
if [ -f nginx/conf.d/default-http-only.conf ]; then
  cp nginx/conf.d/default-http-only.conf nginx/conf.d/default.conf
fi
echo

# Start nginx with HTTP-only config
echo "### Starting nginx with HTTP-only config ..."
docker compose -f docker-compose.prod.yml up -d nginx
sleep 5  # Give nginx time to start
echo

# Verify nginx is responding
echo "### Verifying nginx is accessible ..."
if docker compose -f docker-compose.prod.yml exec -T nginx wget -q --spider http://localhost/health 2>/dev/null; then
  echo "✓ Nginx is responding"
else
  echo "✗ Warning: Nginx health check failed, but continuing..."
fi
echo

# Request Let's Encrypt certificate
echo "### Requesting Let's Encrypt certificate for $domains ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

# Restore HTTPS config
echo "### Restoring HTTPS config ..."
rm nginx/conf.d/default.conf
if [ -f nginx/conf.d/default-https.conf.tmp ]; then
  mv nginx/conf.d/default-https.conf.tmp nginx/conf.d/default.conf
fi
echo

# Restart nginx with HTTPS config
echo "### Restarting nginx with HTTPS ..."
docker compose -f docker-compose.prod.yml restart nginx
echo

# Wait for nginx to be ready
sleep 3

echo "### SSL certificates successfully obtained and configured!"
echo "### Your site is now accessible via HTTPS at https://$domains"
echo ""
echo "### Testing HTTPS (this may take a moment) ..."
if curl -sf -o /dev/null https://$domains/health 2>/dev/null; then
  echo "✓ HTTPS is working correctly!"
else
  echo "! HTTPS test inconclusive. Please test manually: https://$domains"
fi
