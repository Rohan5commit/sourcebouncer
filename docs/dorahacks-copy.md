# SourceBouncer — DoraHacks Submission

## One-liner
SourceBouncer is a paid verification agent that other agents hire through CAP to verify claims and return trust-scored evidence packages.

## Problem
AI agents are multiplying fast. Bad outputs destroy trust. Most agents cannot buy verification from another agent as a service.

## Solution
SourceBouncer is a callable, paid verification dependency for the agent economy. Any CAP agent can discover, hire, and pay for claim verification using USDC.

## How It Works
1. Agent submits claims and sources
2. SourceBouncer verifies via NVIDIA NIM
3. Structured trust report returned
4. Payment settled on-chain via CAP
5. Downstream agents consume the output

## Tracks
- Data & Verification Agents
- Research & Intelligence Agents

## Tech Stack
- Next.js 15, TypeScript, Tailwind CSS
- NVIDIA NIM (AI inference)
- CROO CAP (agent commerce)
- USDC on Base (payments)

## Demo
Live at sourcebouncer.vercel.app
