# Hackathon Notes — SourceBouncer

## Project Summary

I built SourceBouncer for the CROO Agent Hackathon. The idea: AI agents need to verify claims before acting on them, and they should be able to hire other agents to do this verification through a standard protocol.

## Why This Project?

I kept seeing news about AI agents giving wrong information. Financial agents making bad trades based on false data. Research agents citing fake sources. The trust problem is real.

CAP solves the payment problem (how do agents pay each other?), but there's no standard for what agents actually DO for each other. Verification is the most obvious use case — every agent needs it.

## What I Built

1. **Verification Engine** — Takes claims + sources, returns structured trust reports
2. **CAP Integration** — Full lifecycle: discovery → negotiation → escrow → delivery → settlement
3. **Web Interface** — 8 pages showing the full flow
4. **API Endpoints** — Other agents can call /api/verify programmatically

## What Took the Most Time

- Understanding the CAP protocol lifecycle (took a few hours to get right)
- Building the verification engine with proper fallback handling
- Making the UI look professional with Tailwind

## What I'd Do With More Time

- Real WebSocket listener for incoming CAP jobs
- PostgreSQL database for persistent storage
- Rate limiting and auth
- Monitoring dashboard
- More sophisticated AI analysis (multi-step reasoning)

## How to Test It

1. Go to https://sourcebouncer.vercel.app/demo
2. Enter some claims (try "The sky is blue" and "The Earth is flat")
3. Add sources
4. Click "Submit for Verification"
5. Watch the AI analyze each claim
6. Check the Audit page for the CAP lifecycle

---
*Built by Rohan for the CROO Agent Hackathon*
