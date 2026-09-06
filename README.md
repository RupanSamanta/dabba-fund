# Dabba Fund

A contribution and transaction tracker for managing a shared fund, contributors, and purchase requests.

## Project structure

- `client`: Vite + React frontend
- `server`: Express API
- `server/db/schema.sql`: MySQL database schema

The frontend and API are deployed separately. The frontend needs the public API URL, and the API needs access to a managed MySQL database.

## Local development

Requirements: Node.js 20 or newer and MySQL 8 or compatible.

1. Create the database and tables by running `server/db/schema.sql` in MySQL.
2. Copy `server/.env.example` to `server/.env` and set the database values.
3. Copy `client/.env.example` to `client/.env`.
4. Install and start the API:

	```powershell
	cd server
	npm install
	npm run dev
	```

5. Install and start the frontend in a second terminal:

	```powershell
	cd client
	npm install
	npm run dev
	```

The API health check is available at `http://localhost:8888/health`.

## Environment variables

### Client

Copy `client/.env.example` to `client/.env`:

- `VITE_API_URL`: deployed API URL. Leave empty for same-origin hosting.
- `VITE_BASE_PATH`: frontend base path, normally `/`; use `/dabba-fund/` for GitHub Pages.
- `VITE_DEV_API_URL`: local Vite proxy target, normally `http://localhost:8888`.

### Server

Copy `server/.env.example` to `server/.env` or configure the same values in the hosting provider:

- `PORT`: port supplied by the hosting provider
- `HOST`: bind address, normally `0.0.0.0`
- `CLIENT_ORIGIN`: allowed frontend origin; multiple origins may be comma-separated
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: managed MySQL connection settings

Never commit `.env` files or place database credentials in frontend variables. `VITE_*` values are public in the browser bundle.

## Cloud deployment

Deploy the `server` directory as a Node service:

- Build command: none
- Start command: `npm start`
- Health check: `/health`
- Set all variables from `server/.env.example`
- Set `CLIENT_ORIGIN` to the deployed frontend HTTPS URL

Deploy the `client` directory as a static Vite site:

- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_URL` to the deployed API HTTPS URL
- Set `VITE_BASE_PATH=/` unless the host serves the app from a subpath

Provision MySQL separately and run `server/db/schema.sql` before using the API. The database must accept connections from the API host.
