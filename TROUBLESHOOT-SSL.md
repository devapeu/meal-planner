# SSL Setup Troubleshooting

## Error: "Connection refused" during certificate request

### Check 1: Is Nginx Running?

```bash
docker-compose -f docker-compose.prod.yml ps
```

You should see `meal-planner-nginx` with status "Up". If not:

```bash
docker-compose -f docker-compose.prod.yml logs nginx
```

### Check 2: Is Port 80 Open on Your Server?

**Check if nginx is listening:**
```bash
docker-compose -f docker-compose.prod.yml exec nginx netstat -tlnp | grep :80
```

**Check from your local machine:**
```bash
curl -I http://api.mealplanner.pierodelvalle.com
```

Should return HTTP response, not "Connection refused".

### Check 3: Firewall Rules

**On your server (DigitalOcean/AWS/etc), ensure ports 80 and 443 are open:**

For UFW (Ubuntu):
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

For DigitalOcean:
- Go to Networking → Firewalls
- Ensure HTTP (80) and HTTPS (443) are allowed

For AWS Security Groups:
- Add inbound rules for ports 80 and 443

### Check 4: Verify Nginx Config

```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Check 5: Test ACME Challenge Directory

```bash
# Create a test file
mkdir -p certbot/www/.well-known/acme-challenge
echo "test" > certbot/www/.well-known/acme-challenge/test.txt

# Try to access it
curl http://api.mealplanner.pierodelvalle.com/.well-known/acme-challenge/test.txt
```

Should return "test". If not, nginx isn't serving the certbot webroot correctly.

## Common Fixes

### Fix 1: Restart Nginx
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

### Fix 2: Check Docker Port Mapping
```bash
docker-compose -f docker-compose.prod.yml ps
```

Ensure nginx shows: `0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp`

### Fix 3: Temporarily Stop Other Services on Port 80
```bash
# Check what's using port 80
sudo lsof -i :80
# or
sudo netstat -tlnp | grep :80

# If something else is running, stop it first
```

## After Fixing

Once port 80 is accessible, re-run:
```bash
./init-letsencrypt.sh
```
