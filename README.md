# SourceBouncer

**Paid verification and citation agent for the CROO agent economy.**

SourceBouncer is a callable verification agent that other agents can hire through CAP (CROO Agent Protocol) to verify claims, inspect source quality, detect unsupported statements, and return a trust-scored evidence package with citations.

> **⚠️ CAP Integration Status: Protocol-Flow Demo (Simulated Settlement)**
>
> This submission demonstrates the **complete CAP lifecycle** — discovery, negotiation, escrow, delivery, and settlement — using in-memory simulation. The code is structured to connect to real CAP infrastructure with zero code changes: just set `CROO_SDK_KEY` and `CROO_AGENT_WALLET` environment variables with a funded wallet on Base. The settlement records shown in the Audit view use generated transaction hashes for demonstration purposes. See [SUBMISSION.md](./SUBMISSION.md) for a full honest breakdown of what's real vs simulated.

## Tracks Targeted

1. **Data & Verification Agents** — Core verification engine with structured trust reports
2. **Research & Intelligence Agents** — Source analysis and citation validation

## Why Verification is a Paid Agent Dependency

AI agents are multiplying fast. Bad outputs destroy trust. Most agents still cannot buy verification from another agent as a service. CROO solves discoverability, payment, and agent-to-agent commerce. SourceBouncer proves that the future agent stack will include paid verification as a reusable dependency.

## What's Real vs Simulated

| Component | Status | Notes |
|-----------|--------|-------|
| **CAP Protocol Flow** | ✅ Real code | Full lifecycle: invoke → escrow → deliver → settle |
| **NVIDIA NIM AI** | ✅ Real | Live inference with rule-based fallback when API is down |
| **Trust Reports** | ✅ Real | Structured JSON with claim verdicts, scores, citations |
| **Zod Schemas** | ✅ Real | Full validation for all input/output types |
| **USDC Settlement** | ⚡ Simulated | In-memory records; real on-chain with `CROO_SDK_KEY` + funded wallet |
| **Agent Store Listing** | ✅ Ready | Metadata and `/api/store` endpoint ready for CAP registry |
| **A2A Composability** | ✅ Real | Output JSON is machine-readable and composable by downstream agents |

## How CAP Integration Works

1. **Discovery** — Agents find SourceBouncer on the CROO Agent Store
2. **Negotiation** — Requester initiates CAP negotiation with pricing/SLA
3. **Escrow** — USDC locked in smart contract escrow on Base
4. **Delivery** — SourceBouncer verifies claims and returns structured report
5. **Settlement** — Payment released on-chain, reputation updated

**To enable live settlements:** Set `CROO_SDK_KEY` and `CROO_AGENT_WALLET` (funded with USDC on Base) in your environment. The code switches from simulation to live CAP automatically.

## How Downstream Agents Consume Outputs

SourceBouncer returns a structured `TrustReport` JSON object that includes:
- Claim-by-claim verdicts (supported/unsupported/contradicted)
- Source relevance scores
- Trust scores with confidence levels
- Revision suggestions
- Overall summary

Any agent can parse this JSON and act on it programmatically.

## Setup

### Prerequisites
- Node.js 18+
- npm
- NVIDIA NIM API key
- (Optional) CROO CAP wallet for live settlements

### Install

```bash
git clone https://github.com/Rohan5commit/sourcebouncer.git
cd sourcebouncer
npm install
```

### Environment Variables

```bash
# Required: NVIDIA NIM API key
NVIDIA_NIM_API_KEY=nvapi-...
NVIDIA_NIM_API_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=meta/llama-3.3-70b-instruct

# Optional: CROO CAP wallet (for live settlements — without these, runs in simulation mode)
CROO_SDK_KEY=
CROO_AGENT_WALLET=0x...
CROO_API_URL=https://cap.croo.network
CROO_WS_URL=wss://cap.croo.network
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

```bash
npx vercel --prod
```

## CROO Agent Store Listing

- **Name:** SourceBouncer
- **Category:** Data & Verification
- **Pricing:** $0.50 / $2.00 / $5.00 USDC per verification
- **Capabilities:** claim-verification, source-analysis, contradiction-detection, trust-scoring, citation-validation
- **Callable by:** Humans and other agents via CAP

## Demo Flow

1. Submit claims and sources on the Demo page
2. Select pricing tier and submit
3. View trust report with claim-by-claim verdicts
4. See on-chain settlement in the Audit view (simulated)
5. Ask follow-up questions about the results
6. See how downstream agents consume the output

## Limitations

- Demo uses in-memory storage (not persistent across cold starts)
- CAP settlements are simulated (in-memory records with generated tx hashes)
- Live CAP settlements require `CROO_SDK_KEY` + funded USDC wallet on Base
- AI analysis quality depends on NVIDIA NIM model availability (has rule-based fallback)

## Future Work

- Persistent database storage
- Real CAP WebSocket listener for live agent-to-agent jobs
- Browser extension for human verification
- Batch verification API
- Reputation scoring system

## License

MIT
