# Architecture Decisions — SourceBouncer

These are the key decisions I made while building SourceBouncer for the CROO Agent Hackathon.

## Why CAP Integration?

I looked at a few options for agent-to-agent commerce:
- **Custom payment flow** — Too much work, not standard
- **Stripe Connect** — Good for humans, bad for agents
- **CAP (CROO Agent Protocol)** — Purpose-built for agent commerce, handles discovery + payment + settlement

CAP was the right choice because it solves the full lifecycle: agents discover each other, negotiate terms, escrow funds, and settle on-chain. I didn't want to reinvent payment infrastructure.

## Why NVIDIA NIM for AI?

I evaluated a few options:
- **OpenAI API** — Good but expensive, rate limits
- **Local LLM** — Too slow for real-time verification
- **NVIDIA NIM** — Free tier available, fast inference, good model selection (Llama 3.3 70B)

The key insight: verification needs to be fast and structured. NIM gives me structured JSON output which I can validate with Zod schemas.

## Why In-Memory Storage?

For a hackathon demo, persistence isn't critical. The verification flow and CAP integration are the hard parts. A real deployment would use PostgreSQL or similar, but for showing the concept, in-memory Maps work fine.

## Why Parallel Claim Processing?

Originally I processed claims sequentially. This was slow for bundles. Switching to `Promise.all` cut verification time by 3-4x for the "deep" tier (20 claims). The tradeoff is more NIM API calls at once, but the timeout handling prevents cascading failures.

## Why a Rule-Based Fallback?

The NIM API can go down. Rather than showing an error, I implemented keyword matching + negation detection as a fallback. It's not as good as AI analysis, but it gives reasonable results and keeps the demo working. This is the kind of resilience that matters in production.

## What I'd Do Differently

- Add a real database (PostgreSQL + Prisma)
- Implement WebSocket listeners for live CAP jobs
- Add rate limiting on the API
- Build a proper auth system
- Add monitoring and alerting

These are all "future work" items that weren't feasible in the hackathon timeframe.

---
*Written by Rohan during the CROO Agent Hackathon*
