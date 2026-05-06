# Catalyst

Component-based frontend for Catalyst.

## Stack

- React
- Vite
- Google-authenticated API persistence through the Catalyst backend

## Project Structure

```txt
src/
  components/
    layout/      App shell, header, progress strip
    ui/          Reusable UI components
  data/          Seed content for checklist, ads, roadmap, Q&A
  pages/         Feature pages
  services/      API client, auth, checklist, and finance services
  styles/        Global style copied from the original visual direction
  utils/         Formatters and small helpers
```

## Run Locally

```bash
npm install
npm run dev
```

Set the API URL in `.env.local`:

```text
VITE_API_BASE_URL=http://localhost:3000
```

## Deploy to Netlify

Netlify builds Vite environment variables into the frontend bundle, so add this in
the frontend Netlify site's environment variables before deploying:

```text
VITE_API_BASE_URL=https://catalyst-api.netlify.app
```

The value must be the backend origin only, without `/api` at the end. After
changing this variable in Netlify, trigger a new frontend deploy because Vite
bakes this value into the built JavaScript bundle.

The Google login button starts OAuth at:

```text
https://catalyst-api.netlify.app/api/auth/google
```

It should not link directly to `/api/auth/google/callback`; Google redirects to
the callback after the user approves the login.
