# ALDER CRM

**A**dvisory **L**ead **D**evelopment and **E**ngagement **R**egistry — a purpose-built CRM for **North State Senior Solutions**, a senior living referral and advisory business operating in Northern California.

---

## Features

- **Lead Management** — Full lifecycle from first call to move-in, with care assessments, urgency tracking, and status pipeline
- **Family Contact Tracking** — Store and manage multiple family/decision-maker contacts per lead
- **Community Network** — Maintain a database of partner senior living communities with pricing, care levels, and referral agreements
- **Referral Pipeline** — Track referrals from submission through tour scheduling, acceptance, and move-in
- **Communication Log** — Chronological activity timeline per lead (calls, emails, tours, meetings)
- **Dashboard** — At-a-glance stats: active leads, new this month, referrals sent, tours scheduled, move-ins, and estimated revenue
- **Follow-Up Alerts** — Dashboard surface leads with overdue follow-up dates

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 (Credentials provider) |
| Database | Prisma ORM + SQLite (dev) |
| Notifications | react-hot-toast |
| Date handling | date-fns |

---

## Folder Structure

```
alder/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seed
├── src/
│   ├── app/
│   │   ├── (auth)/login/   # Login page
│   │   ├── (dashboard)/    # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── communities/
│   │   │   ├── referrals/
│   │   │   └── communications/
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # Badge, Button, Card, Input, Modal, Select, StatCard
│   │   ├── leads/          # LeadCard, LeadForm, LeadStatusBadge
│   │   ├── communications/ # CommunicationForm, CommunicationList
│   │   ├── referrals/      # ReferralForm
│   │   └── layout/         # Sidebar, Header
│   └── lib/
│       ├── auth.ts         # NextAuth configuration
│       ├── constants.ts    # Status configs, enums
│       ├── prisma.ts       # Prisma singleton
│       ├── types.ts        # TypeScript interfaces
│       └── next-auth.d.ts  # Auth type extensions
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
cd alder
npm install
```

### Database Setup

```bash
# Push schema to SQLite
npm run db:push

# Seed with sample data
npm run db:seed
```

### Environment

The `.env` file is pre-configured for local development:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="alder-crm-secret-dev-only"
```

> **Important:** Change `NEXTAUTH_SECRET` to a strong random value in production.

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@northstate.com | password123 | Admin |
| advisor@northstate.com | password123 | Advisor |

---

## Lead Status Pipeline

```
NEW_LEAD → ASSESSING → TOURING → REFERRED → MOVED_IN
                                          ↘ LOST_CLOSED
```

## Urgency Levels

- **Low** — Early planning, 3-6+ months out
- **Medium** — Actively looking, 1-3 months
- **High** — Needs placement within 1 month
- **Urgent** — Hospital discharge or immediate need

---

## Future Features (Roadmap)

- [ ] Email notifications for follow-up reminders
- [ ] Referral fee invoicing / PDF generation
- [ ] Calendar integration for tour scheduling
- [ ] Reports: monthly placement report, revenue by community
- [ ] Multi-location / multi-advisor assignment
- [ ] Client portal for family self-service updates
- [ ] SMS integration for quick contact logging
- [ ] Bulk import from spreadsheet
- [ ] VA benefits tracking for veteran leads
- [ ] Automated follow-up reminder emails
- [ ] Mobile app (React Native)

---

## Data Model Overview

- **User** — Staff members (advisors, admins)
- **Lead** — A senior requiring placement services
- **FamilyContact** — Decision-makers associated with a Lead
- **Community** — A senior living facility in the network
- **Referral** — A Lead referred to a Community (the core transaction)
- **Communication** — An activity log entry for any Lead interaction

---

*Built for North State Senior Solutions — Chico, CA*
