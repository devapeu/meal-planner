# Meal Planner

Weekly meal planner with a shopping list and recipes to add from made with Vue 3 and a Django + PostgreSQL backend.

## Backend

The backend lives in `/api` and is a Django REST project that exposes the same routes used by the Vue frontend.

### Setup

Deploy for both development and production using Docker.

#### Development

```sh
# Copy development environment template
cp .env.dev.example .env

# Run development containers
docker compose up -d
```

#### Production

```bash
# Copy production environment template
cp .env.example .env

# Edit .env with secure production values
nano .env
```

**Important:** Set these values in `.env`:
- `DJANGO_SECRET_KEY` - Generate with: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- `DJANGO_DEBUG=false` - Must be false in production
- `DJANGO_ALLOWED_HOSTS` - Your domain(s), comma-separated
- `DB_PASSWORD` - Strong database password
- `FRONTEND_URL` - Your frontend URL (for CORS)

```bash
# Build and start production containers
docker compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker compose -f docker-compose.prod.yml exec api python manage.py migrate 

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Access the application
# API: http://localhost (Nginx on port 80)
```

## Frontend

### Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev -- --host
```

### Compile and Minify for Production

Assuming a static hosted service like Netlify, just set as your build command:

```sh
npm run build
```
