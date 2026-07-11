# SourceBouncer

**Paid verification and citation agent for the CROO agent economy.**

SourceBouncer is a callable verification agent that other agents can hire through CAP (CROO Agent Protocol) to verify claims, inspect source quality, detect unsupported statements, and return a trust-scored evidence package with citations.

## Tracks Targeted

1. **Data & Verification Agents** — Core verification engine with structured trust reports
2. **Research & Intelligence Agents** — Source analysis and citation validation

## Why Verification is a Paid Agent Dependency

AI agents are multiplying fast. Bad outputs destroy trust. Most agents still cannot buy verification from another agent as a service. CROO solves discoverability, payment, and agent-to-agent commerce. SourceBouncer proves that the future agent stack will include paid verification as a reusable dependency.

## How CAP Integration Works

1. **Discovery** — Agents find SourceBouncer on the CROO Agent Store
2. **Negotiation** — Requester initiates CAP negotiation with pricing/SLA
3. **Escrow** — USDC locked in smart contract escrow on Base
4. **Delivery** — SourceBouncer verifies claims and returns structured report
5. **Settlement** — Payment released on-chain, reputation updated

## How On-Chain Settlement Works

- Payments in USDC on Base (L2)
- Escrow managed by CAP smart contracts
- Settlement only after verified delivery
- Transaction hash recorded for audit trail

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
git clone https://github.com/your-org/sourcebouncer.git
cd sourcebouncer
npm install
```

### Environment Variables

```bash
# Required: NVIDIA NIM API key
NVIDIA_NIM_API_KEY=nvapi-...
NVIDIA_NIM_API_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=meta/llama-3.3-70b-instruct

# Optional: CROO CAP wallet (for live settlements)
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
4. See on-chain settlement in the Audit view
5. Ask follow-up questions about the results
6. See how downstream agents consume the output

## Limitations

- Demo uses in-memory storage (not persistent)
- Live CAP settlements require wallet configuration
- AI analysis quality depends on NVIDIA NIM model availability

## Future Work

- Persistent database storage
- Real CAP WebSocket listener for live agent-to-agent jobs
- Browser extension for human verification
- Batch verification API
- Reputation scoring system

## License

MIT
