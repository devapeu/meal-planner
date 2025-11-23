#!/bin/bash

# This script initializes Let's Encrypt SSL certificates for your domain
# Run this ONCE when setting up HTTPS for the first time

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    echo "Please create .env from .env.example and configure your domain"
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

# Create dummy certificate for nginx to start
echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

# Start nginx with dummy certificate
echo "### Starting nginx ..."
docker compose -f docker-compose.prod.yml up --force-recreate -d nginx
echo

# Delete dummy certificate
echo "### Deleting dummy certificate for $domains ..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
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

# Reload nginx to load the real certificates
echo "### Reloading nginx ..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
echo

echo "### SSL certificates successfully obtained and configured!"
echo "### Your site is now accessible via HTTPS at https://$domains"
