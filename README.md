<p align="center">
  <img src="frontend/src/assets/blocck3.png" alt="Blocck logo" width="160" />
</p>

## Blocck

An innovation-first project exploring blockchain primitives and sustainable funding models for makers. Blocck experiments with token mechanics, upgradeability, and community-driven governance to act as building blocks for a broader ecosystem.

### Why
- Prototype and validate new on-chain concepts quickly
- Create transparent rails to fund independent builders and experiments
- Share learnings, patterns, and reusable components with the community

---

## Tech Overview
- Smart contracts: Solidity, OpenZeppelin upgradeable (UUPS)
- Tooling: Hardhat, Ethers, OZ Upgrades Plugin
- Frontend: React + Vite (prototype UI)

### Core ERC20
- Name: `Blocck`
- Symbol: `BLOCCK`
- Standard: ERC20 (upgradeable via UUPS)
- Max supply: 1,000,000 BLOCCK
- Initial mint: exactly 1,000,000 tokens minted to the deployer account at initialization
- Owner: set during `initialize`, controls upgrades and `mint` (guarded not to exceed max supply)

Note: Initial tokens are minted to `msg.sender` (the deployer). If a different recipient is intended, deploy from that wallet or transfer post-deploy.

---

## Getting Started

### Prerequisites
- Node.js LTS (18+ recommended)
- npm

### Install
```bash
npm install
```

### Environment
Create a `.env` in the repo root:
```bash
RPC_URL="<your-ethereum-json-rpc>"   # e.g. Sepolia
PRIVATE_KEY="0x<your-funded-deployer-private-key>"
```

### Compile and Test
```bash
npm run compile
npm run test
```

### Local Dev Chain
```bash
npm run node
# In another terminal
npm run deploy:local
```

### Deploy (Sepolia example)
```bash
npm run deploy -- --network sepolia
```
Post-deploy, record the proxy address and implementation address. Do not hardcode addresses in the frontend; persist them in a secure config/keystore service and load at runtime.

---

## Funding Makers
Blocck’s north star is to prototype mechanisms that channel capital to builders. This repository will iterate on:
- Transparent treasury and disbursement flows
- Upgrade paths to evolve funding logic safely
- Open metrics and reporting for accountability

If you’re a builder experimenting with primitives (governance, identity, infra, creator tooling), open an issue with your proposal.

---

## Development Notes
- Upgradeability: UUPS with owner-gated `_authorizeUpgrade`. Transfer ownership to a multisig for production. If upgrades are not desired, consider renouncing ownership after verification.
- Supply: Hard-capped at 1,000,000 BLOCCK; minting beyond the cap is prevented at the contract level.
- Frontend: Minimal prototype, meant to evolve alongside the funding models.

---

## Scripts
```bash
npm run compile        # hardhat compile
npm run test           # hardhat test
npm run node           # hardhat node
npm run deploy         # hardhat run scripts/deploy.js
npm run deploy:local   # deploy to local hardhat network
```

---

## Roadmap (short-term)
- Treasury and grant disbursement contract(s)
- Governance hooks for community input
- Public dashboards for transparency

---

## Contributing
Issues and PRs are welcome. Please include context, rationale, and minimal repro steps when relevant.

## License
MIT

