# Capstone Project - Vocasia Kampus Merdeka

## Installation

1. Clone the repository

```bash
git clone
```

2. Install dependencies

```bash
npm install
```

3. Copy the .env.example file to .env

```bash
cp .env.example .env
```

4. Set the environment variables in .env

```

NODE_ENV=development

APP_URL=http://localhost:3000
APP_PORT=3000

# database
DB_HOST=127.0.0.1
DB_DRIVER=mysql
DB_NAME=laundry_db
DB_USER=root
DB_PASS=root
DB_PORT=3306

```

5. Run this command to run migration and seeders

```bash
npm run db:migrate
```

6. Run the app

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to generate controller

1. Run the command below in backend folder

```bash
npm run make:controller <name>
```

2. The controller will be generated in the controllers folder
