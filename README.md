# Meal Planner

Weekly meal planner with a shopping list and recipes to add from made with Vue 3 and a Django + MySQL backend.

## Backend

The backend lives in `/api` and is a Django REST project that exposes the same routes used by the Vue frontend.

### Setup

```sh
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp env.sample .env
python manage.py migrate
# Optional: reset schema/data (drops tables!)
mysql -u <user> -p <database> < database.sql
python manage.py runserver 0.0.0.0:8000
```

Update `.env` with your database credentials, frontend URL, and secret key. The frontend continues to hit `/calendar`, `/shopping-list`, and `/recipes`.

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

```sh
npm run build
```
