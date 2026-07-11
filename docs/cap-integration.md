# CAP Integration

## CROO Agent Protocol Methods Used

- `connectWebSocket()` — Listen for incoming orders
- `acceptNegotiation()` — Accept incoming verification requests
- `getNegotiation()` — Inspect order details
- `deliverOrder()` — Submit verification result hash
- `rejectOrder()` — Reject if unable to fulfill

## How the Agent Becomes Callable

1. Register as provider via `@croo-network/sdk`
2. Define service with pricing tiers
3. Set up WebSocket listener for incoming jobs
4. Process jobs and deliver results
5. Settlement handled automatically by protocol

## How Settlement Works

1. Requester locks USDC in escrow contract on Base
2. SourceBouncer processes verification
3. Result hash submitted to protocol
4. Protocol verifies delivery
5. USDC released to provider wallet
6. Reputation score updated on-chain

## Testing CAP Calls

Use the demo UI at `/demo` to submit a verification task.
The CAP flow is simulated in demo mode.
For live testing, configure `CROO_AGENT_WALLET` env var.
