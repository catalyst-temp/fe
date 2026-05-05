# Product Requirements Document

## Product Name

Catalyst

## Summary

Catalyst is a web app for early-stage Indonesian online sellers who need a simple operating dashboard to plan, track, and improve their business. The product combines a guided business checklist, ad evaluation tools, financial tracking, HPP/pricing calculators, a 5-year business roadmap, and practical Q&A content.

The current prototype is a single-page HTML app. The production version should be rebuilt using the MERN stack with Google OAuth authentication and MongoDB persistence so each user can save their own progress, financial records, calculator histories, and business settings.

## Goals

- Help beginner online sellers know what to do next when starting or growing a store.
- Replace scattered notes and manual spreadsheets with one focused business tracker.
- Make core business numbers easy to understand: revenue, expenses, profit, margin, ROAS, HPP, ad spend ratio, and operational ratio.
- Save user progress across devices with account-based login.
- Provide a clean foundation for future features such as dashboards, reminders, exports, and marketplace integrations.

## Non-Goals

- Direct integration with Shopee, TikTok Shop, Tokopedia, or Meta Ads in the MVP.
- Accounting-grade bookkeeping or tax reporting.
- Multi-user company workspaces in the first release.
- Automated financial advice requiring regulated financial compliance.

## Target Users

### Primary User

Beginner to intermediate Indonesian online sellers who sell through marketplaces such as Shopee, TikTok Shop, Tokopedia, Instagram, or WhatsApp.

### User Pain Points

- They do not know the correct sequence for starting an online business.
- They often run ads before their store, pricing, reviews, and product pages are ready.
- They calculate profit too simply and forget packaging, platform fees, shipping subsidy, ads, and operational costs.
- Their financial records are scattered or not recorded at all.
- They need practical guidance, not complicated enterprise tools.

## Core Value Proposition

Bisnis Online gives small sellers a clear operating system: what to do, what to measure, and when to scale.

## MVP Features

### 1. Authentication

Users must be able to sign in with Google OAuth.

Requirements:

- Sign in with Google.
- Create user account automatically on first login.
- Store user profile: name, email, avatar, Google account ID.
- Maintain secure session with HTTP-only cookies or JWT strategy.
- Allow logout.
- Protect all private user data behind authentication.

### 2. Business Checklist

Users can track progress through business setup phases.

Current phases from prototype:

- Foundation and product readiness.
- Store setup and listing optimization.
- Organic traffic and content.
- Marketplace trust signals.
- Paid ads and scaling readiness.

Requirements:

- Show checklist grouped by phases.
- Mark checklist items as done or undone.
- Calculate total progress percentage.
- Show phase completion state.
- Reset checklist progress.
- Save progress per authenticated user.

### 3. Ad Evaluation

Users can learn and evaluate basic ad performance.

Requirements:

- Explain key ad metrics: ROAS, CTR, CPC, CPA, impressions.
- Provide decision guidance based on metric performance.
- Include checklist before running ads.
- Provide ROAS calculator using ad budget, revenue, selling price, COGS, and estimated fees.
- Show verdict: profitable, needs optimization, or stop campaign.

### 4. Financial Tracker

Users can record simple business income and expenses.

Requirements:

- Add income transaction.
- Add expense transaction.
- Choose transaction category.
- Add date, note, and amount.
- Delete transaction.
- Filter by all, income, or expense.
- Show total income, total expense, and net profit.
- Show financial health indicators:
  - profit margin
  - ad spend ratio
  - operational expense ratio
- Save all transactions per authenticated user.

### 5. HPP and Pricing Calculator

Users can calculate full product cost and expected margin.

Requirements:

- Support reseller mode.
- Support self-production mode.
- Include costs:
  - product purchase or raw materials
  - supplier shipping
  - labor
  - overhead
  - packaging
  - bubble wrap or tape
  - platform fee percentage
  - shipping subsidy
  - ad cost per item
- Allow manual ad cost per item.
- Allow automatic ad cost estimate from daily ad budget and target orders.
- Calculate:
  - total HPP
  - profit per item
  - margin percentage
  - suggested minimum selling price
- Show cost breakdown by component.
- Show pricing verdict.

### 6. 5-Year Roadmap

Users can view a practical business growth roadmap.

Requirements:

- Show roadmap by year or stage.
- Include stage goals, milestones, revenue targets, and decision points.
- Keep roadmap content editable from database or admin seed data for future iteration.

### 7. Q&A Knowledge Base

Users can browse common questions about starting, funding, ads, pricing, and scaling.

Requirements:

- Show accordion-style FAQ.
- Group questions by topic if content grows.
- Keep Q&A content seedable from database.

## Recommended Tech Stack

### Frontend

- React
- Vite
- React Router
- TanStack Query for API data fetching
- Zustand or Context for lightweight UI state
- Tailwind CSS or CSS Modules
- Recharts for charts and financial breakdowns

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js with Google OAuth 2.0, or Auth.js if using a Next-style auth architecture
- Zod or Joi for request validation

### Database

- MongoDB Atlas for managed cloud database
- Mongoose schemas for application models

### Deployment

- Frontend: Vercel, Netlify, or Render static site
- Backend: Render, Railway, Fly.io, or similar Node hosting
- Database: MongoDB Atlas

## MongoDB Recommendation

MongoDB is a good fit for this project.

Reasons:

- User data is document-oriented: checklist progress, transactions, calculator snapshots, settings, and roadmap progress all map naturally to JSON-like documents.
- The schema will evolve as the product grows, especially around calculators, business profiles, marketplace settings, and future analytics.
- The app does not require heavy relational joins in the MVP.
- MERN stack development is fast and consistent because frontend, backend, and database documents all use JavaScript-friendly structures.

Main caution:

Financial records should still be modeled carefully. Use transaction documents with clear fields, timestamps, validation, and immutable history where possible. Do not store important financial data as one giant nested user object.

## Suggested Data Models

### User

- `_id`
- `googleId`
- `name`
- `email`
- `avatarUrl`
- `createdAt`
- `updatedAt`
- `lastLoginAt`

### BusinessProfile

- `_id`
- `userId`
- `businessName`
- `mainChannel`
- `productCategory`
- `currency`
- `createdAt`
- `updatedAt`

### ChecklistProgress

- `_id`
- `userId`
- `completedItemIds`
- `createdAt`
- `updatedAt`

### Transaction

- `_id`
- `userId`
- `type`: `income` or `expense`
- `category`
- `note`
- `amount`
- `transactionDate`
- `createdAt`
- `updatedAt`

### HppCalculation

- `_id`
- `userId`
- `mode`: `reseller` or `production`
- `inputs`
- `results`
- `createdAt`

### RoasCalculation

- `_id`
- `userId`
- `inputs`
- `results`
- `createdAt`

### ContentItem

- `_id`
- `type`: `roadmap`, `faq`, `checklist`, or `ad_guide`
- `slug`
- `title`
- `body`
- `order`
- `metadata`
- `isPublished`
- `createdAt`
- `updatedAt`

## API Requirements

### Auth

- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Checklist

- `GET /api/checklist`
- `GET /api/checklist/progress`
- `PUT /api/checklist/progress`
- `POST /api/checklist/reset`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/summary`

### Calculators

- `POST /api/calculators/roas`
- `POST /api/calculators/hpp`
- `GET /api/calculators/roas/history`
- `GET /api/calculators/hpp/history`

### Content

- `GET /api/content/roadmap`
- `GET /api/content/faq`
- `GET /api/content/ad-guide`

## Key User Flows

### First Login

1. User opens the app.
2. User clicks sign in with Google.
3. App creates or retrieves user account.
4. User lands on dashboard/checklist.
5. User progress and financial records are loaded from API.

### Track Business Setup

1. User opens checklist.
2. User marks items as completed.
3. Progress percentage updates immediately.
4. Backend saves progress.

### Record Transaction

1. User opens Keuangan page.
2. User selects income or expense.
3. User enters category, note, amount, and date.
4. App saves transaction.
5. Dashboard summaries and health ratios update.

### Calculate HPP

1. User opens HPP calculator.
2. User chooses reseller or production mode.
3. User fills cost components and selling price.
4. App calculates HPP, profit, margin, and minimum price.
5. User can optionally save calculation history.

## Success Metrics

- Activation: percentage of users who complete at least 5 checklist items.
- Retention: users who return within 7 days.
- Financial engagement: users who add at least 3 transactions.
- Calculator usage: number of ROAS and HPP calculations per user.
- Completion: percentage of users who finish all phase 1 checklist items.

## MVP Release Scope

Included:

- Google OAuth login.
- Authenticated dashboard shell.
- Checklist progress persistence.
- Financial transaction CRUD.
- ROAS calculator.
- HPP calculator.
- Static or seeded roadmap and FAQ content.
- Responsive mobile-first UI.

Deferred:

- Admin CMS.
- Marketplace API integrations.
- CSV/PDF export.
- Notifications and reminders.
- Multi-business workspaces.
- Team collaboration.
- Subscription billing.

## Security and Privacy Requirements

- Use HTTPS in production.
- Store OAuth secrets only in environment variables.
- Use secure cookies for sessions.
- Validate all API inputs.
- Restrict every user-owned query by `userId`.
- Never expose Google OAuth tokens to the frontend.
- Add rate limiting to auth and write endpoints.
- Sanitize user-provided notes before rendering.

## Open Questions

- Should users be able to manage more than one business?
- Should calculator results be saved automatically or only when the user clicks save?
- Should checklist content be fixed in code or editable from database?
- Should the first release support Indonesian only, or prepare for bilingual content?
- Should users be able to export finance records to CSV?

## Build Recommendation

Start with MERN and MongoDB. It is the right level of flexibility for this product, especially because the early product will evolve quickly. Keep financial transactions as separate documents, keep auth simple and secure, and avoid overbuilding marketplace integrations until the core tracker proves useful.
