# Contributing to SourceBouncer

## Development

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```

## Architecture

- `src/lib/schemas/` — Zod schemas for all input/output types
- `src/lib/ai/` — NVIDIA NIM integration with rule-based fallback
- `src/lib/cap/` — CAP protocol integration
- `src/lib/verification/` — Core verification engine
- `src/components/` — Reusable UI components
- `src/app/` — Next.js pages and API routes

## Code Style

- Use TypeScript strict mode
- Validate all inputs with Zod schemas
- Handle errors gracefully with fallbacks
- Keep components small and focused

## Pull Requests

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a PR

---

*Built by Rohan for the CROO Agent Hackathon*
