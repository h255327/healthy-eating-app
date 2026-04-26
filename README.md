# HealthyEat — Healthy Eating & Diet Planning App

A full-stack web application for healthy eating, meal planning, and nutrition tracking. Built as a university thesis project.

Users can browse and create recipes, log meals, track daily calorie intake, plan weekly diets, generate shopping lists, rate and comment on recipes and articles, and get personalised advice from an AI-powered nutrition chatbot.

---

## Features

| Feature | Description |
|---|---|
| Recipe browser | Search and filter recipes by keyword and category |
| Recipe CRUD | Authenticated users can create, edit, and delete their own recipes |
| Meal logging | Log recipes to breakfast / lunch / dinner / snack for any date |
| Calorie tracker | Daily summary with progress chart vs. target |
| Progress page | Weekly/monthly charts: calories consumed, adherence, estimated weight trend |
| Nutrition info | Per-serving macros (calories, protein, carbs, fat) per recipe |
| TDEE calculator | Mifflin–St Jeor-based recommended calorie target from body metrics |
| Diet planner | Generates a personalised daily meal plan based on user profile |
| Shopping list | Aggregates ingredients from multiple recipes |
| Recipe ratings | 1–5 star ratings per recipe per user |
| Comments | Comments on recipes and articles; admin moderation |
| Articles | Educational nutrition articles with category filtering |
| AI chatbot | OpenAI-powered nutrition assistant personalised to the user's profile |
| Admin panel | User management, content moderation |
| Responsive UI | Works on desktop and mobile browsers |

---

## Technologies

**Frontend**
- React 18 with React Router v6
- Vite 5 (dev server + build)
- Recharts (progress charts)
- Axios (HTTP client)

**Backend**
- Node.js + Express
- mysql2 (MySQL connection pool)
- jsonwebtoken (JWT authentication)
- bcrypt (password hashing)
- OpenAI Node SDK (chatbot)

**Database**
- MySQL 8.x

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v18 or later recommended (developed on v25) |
| npm | v8 or later |
| MySQL | 8.x |
| OpenAI API key | Optional — only needed for the AI chatbot feature |

---

## Project Structure

```
healty-eating-app/
├── backend/
│   ├── scripts/            # Seed and data-import scripts
│   │   ├── seed.js         # Demo user + 12 base recipes + diet types
│   ��   ├── seedMoreRecipes.js  # 30 additional recipes (requires admin user)
│   │   ├── importRecipes.js    # Recipes from TheMealDB API (requires admin user)
│   │   ├── importArticles.js   # 20 curated articles (requires admin user)
│   │   └── seedFoods.js    # 55 common foods with nutrition data
│   ├── src/
│   │   ├── config/         # Database connection (db.js)
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # Database query functions
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   └── utils/          # TDEE calculator, progress helpers
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql          # Base schema (see known issue below)
│   └── migrations/         # Incremental schema changes (002–009)
├── frontend/
│   ├── src/
│   │   ├── components/     # Shared UI components (Navbar, CommentsSection, …)
│   │   ├── pages/          # One file per page/route
│   │   ├── services/       # API client functions
│   │   └── utils/          # TDEE calculator, JWT decode, …
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd healty-eating-app
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd frontend
npm install
```

### 3. Set up the database

#### 3a. Create the database in MySQL

Log in to MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS healthy_eating_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

#### 3b. Apply the base schema

> **Known issue:** `database/schema.sql` line 9 contains `USE healthy_eating_db;`
> which should be `USE healthy_eating_app;`. Fix this line before running, or apply
> the tables manually in the correct database.

```bash
mysql -u <your_user> -p healthy_eating_app < database/schema.sql
```

#### 3c. Apply all migrations in order

```bash
mysql -u <your_user> -p healthy_eating_app < database/migrations/002_add_recipe_fields.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/003_add_article_fields.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/004_rebuild_meal_items.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/006_add_image_url_to_articles.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/007_create_foods_table.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/008_add_user_metrics.sql
mysql -u <your_user> -p healthy_eating_app < database/migrations/009_add_recipe_comments_and_ratings.sql
```

### 4. Configure environment variables

#### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=healthy_eating_app
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
JWT_SECRET=any_long_random_string_here

# Optional — only needed for the AI chatbot feature
OPENAI_API_KEY=sk-...
```

#### Frontend

The frontend reads the API base URL from `VITE_API_BASE_URL`. If the variable is not set it defaults to `http://localhost:5001/api`, so **no `.env` file is required** as long as the backend runs on port 5001.

To override:

```bash
cd frontend
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:5001/api
```

### 5. Seed the database

All seed commands must be run from the `backend/` directory.

```bash
cd backend

# Step 1 — create the demo user, 12 base recipes, and diet types (required first)
npm run seed

# Step 2 — promote the demo user to admin so subsequent scripts work
# Run this in MySQL:
#   UPDATE users SET role = 'admin' WHERE email = 'demo@healthyeat.dev';

# Step 3 — seed additional content (all require the admin user from step 2)
npm run seed-more        # 30 additional recipes
npm run import-articles  # 20 educational articles
npm run seed-foods       # 55 common foods with nutrition data per 100 g

# Optional — import more recipes from TheMealDB (requires internet access)
npm run import-recipes
```

> **Note:** There is no automated script to create an admin account. After running
> `npm run seed`, you must manually promote the demo user to admin via the SQL
> command above. The `seed-more`, `import-articles`, and `import-recipes` scripts
> will all fail with an error if no admin user exists.

---

## Running in Development Mode

Open **two terminals**.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

The API starts at `http://localhost:5001`. Nodemon automatically restarts on file changes.

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

The app opens at `http://localhost:5173`.

---

## Building for Production

```bash
# Build the frontend
cd frontend
npm run build
# Output is in frontend/dist/

# Start the backend in production mode
cd backend
npm start
```

To preview the production frontend build locally:

```bash
cd frontend
npm run preview
```

---

## Tests

There is no automated test suite in this project.

---

## Demo Accounts

After running `npm run seed` in the `backend/` directory:

| Role | Email | Password |
|---|---|---|
| Regular user | `demo@healthyeat.dev` | `demo1234` |
| Admin | *(same account after promotion)* | `demo1234` |

To create an admin account, promote the demo user after seeding:

```sql
UPDATE users SET role = 'admin' WHERE email = 'demo@healthyeat.dev';
```

Or register a new account through the UI and promote it:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Notes for the Evaluator

- **Two terminals are required** to run the project: one for the backend, one for the frontend.
- **Database must be created and seeded before first run.** The application will crash on startup if the database connection fails.
- **The AI chatbot requires an OpenAI API key.** All other features work without it. If `OPENAI_API_KEY` is missing or invalid, the chatbot endpoint will return an error but the rest of the application is unaffected.
- **Admin role is required** to create and edit articles, access the admin panel, and moderate comments. Promote a user via SQL as described above.
- **`seedFoods.js` is required** for the nutrition tracking feature (calorie counter, per-ingredient macro breakdown). Without it the foods database is empty.
- **`schema.sql` line 9 typo:** `USE healthy_eating_db` should be `USE healthy_eating_app`. Pass the correct database name on the `mysql` command line (as shown in the installation steps) to work around this without editing the file.

---

## Troubleshooting

### Backend fails to start — "Database connection failed"

- Verify that MySQL is running.
- Check that `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `backend/.env` are correct.
- Confirm the `healthy_eating_app` database exists: `SHOW DATABASES;` in MySQL.

### Frontend shows blank page or API errors

- Confirm the backend is running on the same port as `VITE_API_BASE_URL` (default `5001`).
- Open the browser developer console and check the network tab for failed requests.
- Ensure `CORS` is not blocked — the backend enables CORS for all origins in development.

### `npm run seed-more` / `import-articles` fails — "No admin user found"

Run `npm run seed` first, then promote the demo user to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'demo@healthyeat.dev';
```

### JWT errors / "Unauthorized" on all requests

- Confirm `JWT_SECRET` is set in `backend/.env` and is not empty.
- Clear `localStorage` in the browser (the old token was signed with a different secret).

### Chatbot returns an error

- Check that `OPENAI_API_KEY` is set in `backend/.env` and is a valid key.
- The chatbot is the only feature that requires the OpenAI key; all other features continue to work without it.

### Port already in use

Change the port in `backend/.env` (`PORT=5001`) and update the frontend `.env` to match:

```env
VITE_API_BASE_URL=http://localhost:<new_port>/api
```
