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

## Deploy to Netlify

The frontend Netlify site proxies `/api/*` to the backend in `netlify.toml`.
This keeps the session cookie first-party in Safari and other stricter browsers.
If the backend Netlify URL changes, update `catalyst-fe/netlify.toml`.

Production builds use same-origin `/api` calls. This avoids browser-specific
third-party cookie blocking even if an old `VITE_API_BASE_URL` value still
exists in Netlify:

```text
VITE_API_BASE_URL
```

The Google login button starts OAuth at:

```text
https://catalyst-temp.netlify.app/api/auth/google
```

It should not link directly to `/api/auth/google/callback`; Google redirects to
the callback after the user approves the login.
