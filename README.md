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
VITE_API_BASE_URL=http://localhost:4000
```
