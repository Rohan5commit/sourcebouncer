# Manual Testing Notes — SourceBouncer

These are the manual tests I ran to verify the app works correctly.

## Landing Page
- [x] Hero section loads with gradient text
- [x] Workflow steps display correctly
- [x] Feature cards render
- [x] CTA buttons link to /demo and /architecture
- [x] No console errors
- [x] Mobile responsive (tested on 375px viewport)

## Demo Page
- [x] Can add multiple claims
- [x] Can add multiple sources
- [x] Pricing tier selection works
- [x] Submit button disables when no claims entered
- [x] Loading state shows spinner
- [x] Results display with trust score and verdicts
- [x] Verdict badges show correct colors (green/yellow/red)
- [x] Revision suggestions display for unsupported claims
- [x] "Run Another" button resets the form

## Results Page
- [x] Trust score displays correctly
- [x] Claim verdicts show with progress bars
- [x] Summary text renders
- [x] Back button works

## Audit Page
- [x] CAP status shows agent ID
- [x] Invocations and settlements list correctly
- [x] Transaction hashes display
- [x] Blue info banner about simulation is visible

## Pricing Page
- [x] Three tiers display with correct prices
- [x] "Most Popular" badge on Deep tier
- [x] Feature comparison shows included/excluded items
- [x] "Try" buttons link to /demo

## Architecture Page
- [x] Verification flow steps display
- [x] Agent Store listing shows metadata
- [x] A2A composability diagram renders
- [x] Blue info banner about simulation is visible

## Ask Page
- [x] Suggested questions display
- [x] Clicking a suggested question sends it
- [x] Custom questions can be typed
- [x] AI responses appear (or fallback if NIM is down)
- [x] Loading state works

## Reuse Page
- [x] Downstream agent examples display
- [x] JSON output example renders

## API Endpoints
- [x] POST /api/verify returns valid JSON
- [x] GET /api/verify returns service info
- [x] GET /api/tasks returns task list
- [x] GET /api/cap/status returns agent status
- [x] GET /api/store returns Agent Store metadata
- [x] POST /api/qa answers questions

## Known Issues
- In-memory storage resets on Vercel cold starts (expected)
- NIM API may timeout on first call (rule-based fallback handles this)
- Settlement records are simulated (documented)

---
*Tested by Rohan on July 11, 2026*
