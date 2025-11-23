# SSL/HTTPS Setup Guide

This guide explains how to set up HTTPS with Let's Encrypt SSL certificates for your production deployment.

## Prerequisites

1. A domain name pointing to your server's IP address
2. Ports 80 and 443 open on your server
3. Docker and Docker Compose installed

## Initial Setup

### 1. Configure Your Domain

Create `.env` file for production (copy from `.env.example`):

```bash
cp .env.example .env
```

Update these values in `.env`:
```env
DOMAIN=yourdomain.com
EMAIL=admin@yourdomain.com
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
DJANGO_SECRET_KEY=your-secure-random-secret-key
DB_PASSWORD=your-secure-database-password
```

**Note**: Docker Compose automatically loads variables from `.env` - no extra flags needed!

### 2. Update Nginx Configuration

Edit `nginx/conf.d/default.conf` and replace all instances of:
- `yourdomain.com` with your actual domain
- `server_name _` with `server_name yourdomain.com www.yourdomain.com`

Update the SSL certificate paths (lines 27-28 and 42):
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
```

### 3. Run the SSL Initialization Script

This script will:
- Download recommended TLS parameters
- Create a temporary certificate for nginx to start
- Request a real certificate from Let's Encrypt
- Reload nginx with the real certificate

```bash
./init-letsencrypt.sh
```

**Important**: The script will fail if:
- Your domain doesn't point to your server
- Ports 80/443 are not accessible
- You've hit Let's Encrypt's rate limits

### 4. Start Your Application

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Your application will now be available at:
- **HTTPS**: `https://yourdomain.com` (secure)
- **HTTP**: `http://yourdomain.com` (redirects to HTTPS)

## Certificate Renewal

Let's Encrypt certificates expire after 90 days. The setup includes **automatic renewal**:

- **Certbot container**: Checks for renewal twice daily
- **Nginx container**: Reloads configuration every 6 hours to pick up renewed certificates

You don't need to do anything - renewals happen automatically!

### Manual Renewal (if needed)

If you need to force a renewal:

```bash
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Testing Your Setup

### 1. Check HTTPS is Working

```bash
curl -I https://yourdomain.com/health
```

Should return `200 OK` with security headers.

### 2. Check HTTP Redirects to HTTPS

```bash
curl -I http://yourdomain.com
```

Should return `301 Moved Permanently` with `Location: https://...`

### 3. Test SSL Certificate

Use SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

You should get an **A** or **A+** rating.

## Security Features Enabled

✅ **TLS 1.2 and 1.3** only (no outdated protocols)
✅ **Strong cipher suites** (modern encryption)
✅ **HTTP Strict Transport Security (HSTS)** - Forces HTTPS for 1 year
✅ **OCSP Stapling** - Faster certificate validation
✅ **X-Frame-Options: DENY** - Prevents clickjacking
✅ **X-Content-Type-Options: nosniff** - Prevents MIME sniffing
✅ **X-XSS-Protection** - Browser XSS filter enabled

## Troubleshooting

### Certificate Request Fails

**Check domain DNS:**
```bash
dig yourdomain.com
nslookup yourdomain.com
```

**Check ports are open:**
```bash
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

**View certbot logs:**
```bash
docker-compose -f docker-compose.prod.yml logs certbot
```

### Nginx Won't Start

**Check nginx config syntax:**
```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

**View nginx logs:**
```bash
docker-compose -f docker-compose.prod.yml logs nginx
```

### Rate Limits

Let's Encrypt has rate limits:
- 50 certificates per registered domain per week
- 5 duplicate certificates per week

**Solution**: Use staging mode for testing:
- Edit `init-letsencrypt.sh`
- Change `staging=0` to `staging=1`
- Test your setup
- Change back to `staging=0` for production

## Architecture

```
Internet (Port 443)
    ↓
Nginx (SSL Termination)
    ↓ (Internal network, port 8000)
Gunicorn/Django API
    ↓ (Internal network, port 5432)
PostgreSQL Database
```

- **Public**: Only nginx on ports 80/443
- **Private**: Gunicorn and PostgreSQL on internal Docker network
- **SSL**: Handled entirely by nginx (Django doesn't need SSL config)

## Files Created

- `nginx/conf.d/default.conf` - Nginx HTTPS configuration
- `init-letsencrypt.sh` - One-time SSL setup script
- `certbot/conf/` - SSL certificates (not in git)
- `certbot/www/` - Let's Encrypt challenge files (not in git)

## Next Steps

After SSL is set up:

1. Update your Vue.js frontend API URL to use HTTPS
2. Test authentication flows over HTTPS
3. Monitor certificate renewal logs occasionally
4. Consider adding a CDN (Cloudflare, etc.) for additional security

## Need Help?

- Let's Encrypt Docs: https://letsencrypt.org/docs/
- Certbot Docs: https://eff-certbot.readthedocs.io/
- Mozilla SSL Config Generator: https://ssl-config.mozilla.org/
