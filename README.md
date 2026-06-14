# Reclaim
> An AI-powered addiction recovery companion that detects relapse risk before it becomes a crisis.

---

## The problem

People in addiction recovery often relapse without anyone in their support network noticing early warning signs. Sponsors and emergency contacts are only contacted reactively — after something has already gone wrong. There is no proactive system that watches for distress signals and acts automatically.

## The solution

Reclaim is a full-stack AI-powered recovery companion that monitors three behavioural signals in real time — journal sentiment, mood patterns, and meeting attendance — and combines them into a single relapse risk score using a weighted engine. When that score crosses defined thresholds, Reclaim automatically notifies the right person before a crisis happens.

### Alert thresholds

| Score | Action |
|-------|--------|
| 0 – 59 | No action |
| 60 – 74 | Sponsor notified by email |
| 75 – 100 | Emergency contact notified by email |

---

## How it works

Every time a user saves a journal entry, Reclaim's relapse engine recalculates their risk score:

- **Mood risk** (40% weight) — analysed from the last 7 mood logs
- **Meeting risk** (30% weight) — based on AA/NA meeting attendance ratio
- **Journal risk** (30% weight) — keyword sentiment analysis of the last 5 entries

The combined score triggers automated email alerts via Brevo SMTP to the appropriate contact, and logs every alert so the user can see their notification history.

Reclaim also integrates Groq (Llama 3 70B) to generate personalised AI insights on the dashboard — referencing the user's actual journal entries, mood history, and days sober to provide context-aware encouragement and advice.

---

## Features

- Sober streak tracking with milestone display
- Daily journaling with real-time risk scoring on save
- Mood logging and 7-day trend analysis
- Meeting attendance tracking
- AI-generated personalised recovery insights
- Automated sponsor and emergency contact email alerts
- Full notification history visible to the user
- Support network and emergency contact management

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, JWT authentication |
| Database | MongoDB |
| AI | Groq API (Llama 3 70B) |
| Email | Nodemailer + Brevo SMTP |
| Architecture | REST API, modular NestJS design |

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Groq API key
- Brevo SMTP credentials

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment variables

```env
# Backend .env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USER=your_brevo_login_email
MAIL_PASS=your_brevo_smtp_key
MAIL_FROM=your_verified_sender_email
```

---

## Architecture

![Reclaim Architecture](./docs/architecture.png)

**Flow:**
1. User logs journal entry, mood, or meeting attendance
2. Relapse engine recalculates weighted risk score
3. If score ≥ 60 → sponsor alerted; if score ≥ 75 → emergency contact alerted
4. Alert logged to notifications collection
5. AI module generates personalised dashboard insights via Groq

---

## Why it matters

Reclaim gives people in recovery a private, low-friction space to track their wellbeing — and gives their support network the one thing they need most: early warning.

Built for the **Microsoft Agents League Hackathon** under the **Hack for Good** and **Top Student** categories.

---

## Roadmap — evolving into a reasoning agent

The current version of Reclaim uses a deterministic weighted scoring engine combined with Groq (Llama 3 70B) for personalised insights. The natural next step is to migrate the AI layer to **Azure AI Foundry** and evolve it into a true **multi-step reasoning agent** that can:

- Autonomously decide which data signals matter most for a given user's recovery pattern
- Reason across journal history, mood trends, and meeting gaps to produce a narrative explanation of risk — not just a score
- Take multi-step actions: assess risk → decide alert level → compose a personalised message → notify the right contact → log the decision chain
- Learn from feedback (did the sponsor reach out? did the user's score improve?) to refine future assessments

This aligns directly with the Microsoft Foundry Reasoning Agents model — where the agent doesn't just respond to a prompt but orchestrates a chain of decisions with observable reasoning steps. The notification pipeline already built in Reclaim forms the action layer that a Foundry agent would orchestrate — making the migration a natural evolution rather than a rebuild.

---