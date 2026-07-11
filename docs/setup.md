# Setup Guide

## Install

```bash
git clone https://github.com/your-org/sourcebouncer.git
cd sourcebouncer
npm install
```

## Environment Variables

Create `.env.local`:

```bash
NVIDIA_NIM_API_KEY=nvapi-your-key-here
NVIDIA_NIM_API_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=meta/llama-3.3-70b-instruct
CROO_AGENT_WALLET=0x0000000000000000000000000000000000000000
```

## NVIDIA NIM Setup

1. Go to https://build.nvidia.com
2. Sign up for an account
3. Generate an API key
4. Add the key to your `.env.local`

## CROO/CAP Setup

1. Install CROO SDK: `npm install @croo-network/sdk`
2. Generate an agent wallet
3. Add wallet address to `.env.local`
4. Register on CROO Agent Store via SDK

## Local Run

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deploys.
